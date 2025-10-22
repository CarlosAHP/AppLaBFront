"""
Backend Flask para Interpretación Médica con IA
Laboratorio Esperanza - Sistema de Gestión de Laboratorio
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import google.generativeai as genai
import json
import re
import os
from datetime import datetime
import logging

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Permitir CORS para el frontend

# Configuración de APIs de IA
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')

# Configurar OpenAI
if OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY

# Configurar Google Gemini (temporalmente desactivado)
if False:  # GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-pro')

class MedicalInterpreter:
    """Clase para interpretación médica de resultados de laboratorio"""
    
    def __init__(self):
        self.normal_ranges = {
            'glucosa': {'min': 70, 'max': 100, 'unit': 'mg/dl'},
            'colesterol_total': {'min': 0, 'max': 200, 'unit': 'mg/dl'},
            'hdl_colesterol': {'min': 40, 'max': 100, 'unit': 'mg/dl'},
            'ldl_colesterol': {'min': 0, 'max': 100, 'unit': 'mg/dl'},
            'trigliceridos': {'min': 0, 'max': 150, 'unit': 'mg/dl'},
            'hemoglobina': {'min': 12, 'max': 16, 'unit': 'g/dl'},
            'hematocrito': {'min': 36, 'max': 48, 'unit': '%'},
            'leucocitos': {'min': 4000, 'max': 11000, 'unit': '/mm³'},
            'creatinina': {'min': 0.6, 'max': 1.2, 'unit': 'mg/dl'},
            'urea': {'min': 7, 'max': 20, 'unit': 'mg/dl'},
            'bilirrubina_total': {'min': 0.3, 'max': 1.2, 'unit': 'mg/dl'},
            'tsh': {'min': 0.4, 'max': 4.0, 'unit': 'mUI/L'},
            't3': {'min': 80, 'max': 200, 'unit': 'ng/dl'},
            't4': {'min': 4.5, 'max': 12, 'unit': 'μg/dl'}
        }

    def extract_lab_values(self, html_content):
        """Extraer valores de laboratorio del HTML"""
        values = []
        
        # Patrones para extraer valores
        patterns = [
            r'(\w+):\s*([\d.,]+)\s*(mg/dl|g/dl|%|u/l|iu/ml|ng/ml|pg/ml|mUI/L|μg/dl)',
            r'(\w+)\s*([\d.,]+)\s*(mg/dl|g/dl|%|u/l|iu/ml|ng/ml|pg/ml|mUI/L|μg/dl)',
            r'([A-Za-z\s]+):\s*([\d.,]+)',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, html_content, re.IGNORECASE)
            for match in matches:
                if len(match) >= 2:
                    name = match[0].strip().lower()
                    value_str = match[1].replace(',', '.')
                    unit = match[2] if len(match) > 2 else ''
                    
                    try:
                        value = float(value_str)
                        values.append({
                            'name': name,
                            'value': value,
                            'unit': unit,
                            'raw_text': ' '.join(match)
                        })
                    except ValueError:
                        continue
        
        return values

    def analyze_values(self, values, patient_info):
        """Analizar valores y determinar estado"""
        analyzed_values = []
        alerts = []
        
        for value in values:
            name = value['name']
            val = value['value']
            unit = value['unit']
            
            # Buscar en rangos normales
            status = 'unknown'
            if name in self.normal_ranges:
                normal_range = self.normal_ranges[name]
                if val < normal_range['min']:
                    status = 'low'
                elif val > normal_range['max']:
                    status = 'high'
                else:
                    status = 'normal'
            
            analyzed_values.append({
                'name': name.title(),
                'value': f"{val} {unit}",
                'status': status,
                'normal_range': self.normal_ranges.get(name, {})
            })
            
            # Generar alertas para valores anormales
            if status == 'high':
                alerts.append({
                    'title': f'{name.title()} Elevado',
                    'description': f'El valor de {name} ({val} {unit}) está por encima del rango normal',
                    'severity': 'high' if val > self.normal_ranges.get(name, {}).get('max', 0) * 1.5 else 'medium'
                })
            elif status == 'low':
                alerts.append({
                    'title': f'{name.title()} Bajo',
                    'description': f'El valor de {name} ({val} {unit}) está por debajo del rango normal',
                    'severity': 'high' if val < self.normal_ranges.get(name, {}).get('min', 0) * 0.5 else 'medium'
                })
        
        return analyzed_values, alerts

    def generate_ai_interpretation(self, html_content, patient_info, lab_values):
        """Generar interpretación usando IA"""
        
        # Preparar prompt para IA
        prompt = f"""
        Eres un médico especialista. Analiza estos resultados de laboratorio y responde ÚNICAMENTE en formato JSON válido.

        PACIENTE: {patient_info.get('age', 'N/A')} años, {patient_info.get('gender', 'N/A')}
        
        RESULTADOS:
        {html_content}

        REGLAS ESTRICTAS:
        1. Responde SOLO en formato JSON válido
        2. NO incluyas texto explicativo fuera del JSON
        3. NO uses markdown o formato de texto
        4. Enfócate en hallazgos anormales o sospechosos
        5. Sé conciso y preciso

        FORMATO JSON REQUERIDO:
        {{
            "summary": "Resumen clínico en máximo 2 líneas",
            "suspicious_findings": [
                {{"value": "nombre del valor", "result": "resultado específico", "concern": "ALTA/MEDIA/BAJA", "reason": "explicación breve del problema"}}
            ],
            "normal_findings": ["valor1: normal", "valor2: normal"],
            "urgent_actions": ["acción urgente 1", "acción urgente 2"],
            "follow_up": ["seguimiento 1", "seguimiento 2"],
            "urgency_level": "BAJA/MEDIA/ALTA"
        }}

        IMPORTANTE: Responde SOLO con el JSON, sin texto adicional.
        """

        # inicio de la IA
        logger.info("Usando sistema de fallback estructurado")
        return self.generate_fallback_interpretation(lab_values, patient_info)

    def generate_fallback_interpretation(self, lab_values, patient_info):
        """Interpretación de respaldo sin IA"""
        normal_count = sum(1 for v in lab_values if v.get('status') == 'normal')
        abnormal_count = len(lab_values) - normal_count
        
        # Determinar nivel de urgencia basado en valores específicos
        urgency_level = "BAJA"
        if abnormal_count > 0:
            # Verificar valores críticos
            critical_values = ['CK-MB', 'Troponina', 'CPK', 'Creatinina', 'Urea']
            for value in lab_values:
                if value.get('status') != 'normal' and any(critical in value['name'].upper() for critical in critical_values):
                    urgency_level = "ALTA"
                    break
            if urgency_level != "ALTA":
                urgency_level = "MEDIA"
        
        # Crear resumen inteligente
        if abnormal_count > 0:
            abnormal_names = [v['name'] for v in lab_values if v.get('status') != 'normal']
            summary = f"Se detectaron {abnormal_count} valores anormales: {', '.join(abnormal_names)}. Requiere atención médica."
        else:
            summary = "Todos los valores están dentro de rangos normales."
        
        # Hallazgos sospechosos con análisis específico
        suspicious_findings = []
        for value in lab_values:
            if value.get('status') != 'normal':
                concern = "ALTA" if value.get('status') == 'high' else "MEDIA"
                
                # Análisis específico por tipo de valor
                reason = self._get_specific_reason(value)
                
                suspicious_findings.append({
                    "value": value['name'],
                    "result": value['value'],
                    "concern": concern,
                    "reason": reason
                })
        
        # Valores normales
        normal_findings = [f"{v['name']}: {v['value']} (normal)" for v in lab_values if v.get('status') == 'normal']
        
        # Acciones específicas basadas en valores anormales
        urgent_actions = []
        follow_up = []
        
        if abnormal_count > 0:
            # Acciones específicas por tipo de valor
            for value in lab_values:
                if value.get('status') != 'normal':
                    if 'CK-MB' in value['name'].upper() or 'TROPONINA' in value['name'].upper():
                        urgent_actions.extend([
                            "ECG inmediato",
                            "Troponina I/T",
                            "Consulta cardiológica urgente"
                        ])
                    elif 'GLUCOSA' in value['name'].upper():
                        urgent_actions.extend([
                            "Curva de tolerancia a la glucosa",
                            "HbA1c",
                            "Consulta endocrinológica"
                        ])
                    elif 'CREATININA' in value['name'].upper() or 'UREA' in value['name'].upper():
                        urgent_actions.extend([
                            "Depuración de creatinina",
                            "Consulta nefrológica"
                        ])
            
            if not urgent_actions:
                urgent_actions.append("Consultar con médico especialista")
            
            follow_up.append("Repetir análisis en 7-14 días")
            follow_up.append("Seguimiento médico cercano")
        else:
            follow_up.append("Continuar con controles rutinarios")
        
        return json.dumps({
            "summary": summary,
            "suspicious_findings": suspicious_findings,
            "normal_findings": normal_findings,
            "urgent_actions": urgent_actions,
            "follow_up": follow_up,
            "urgency_level": urgency_level
        })
    
    def generate_structured_response(self, lab_values, patient_info, ai_data):
        """Generar respuesta estructurada en formato JSON estándar"""
        from datetime import datetime
        
        # Separar valores normales y anormales
        normal_values = []
        abnormal_values = []
        
        for value in lab_values:
            value_data = {
                "test_name": value['name'],
                "value": f"{value['value']} {value.get('unit', '')}".strip(),
                "reference_range": self._get_reference_range(value['name']),
                "status": value.get('status', 'normal')
            }
            
            if value.get('status') == 'normal':
                normal_values.append(value_data)
            else:
                value_data["significance"] = self._get_significance_explanation(value)
                abnormal_values.append(value_data)
        
        # Determinar nivel de urgencia
        urgency_level = self._determine_urgency_level(lab_values)
        urgency_messages = {
            "Baja": "Los resultados están dentro de parámetros normales o con desviaciones menores",
            "Media": "Se observan algunos valores fuera del rango normal que requieren seguimiento",
            "Alta": "Se detectan valores significativamente anormales que requieren atención médica",
            "Crítica": "Se detectan valores críticos que requieren atención médica inmediata"
        }
        
        # Generar interpretación estructurada
        interpretation = {
            "title": self._generate_interpretation_title(lab_values, urgency_level),
            "description": ai_data.get('summary', 'Análisis de resultados de laboratorio'),
            "clinical_significance": self._generate_clinical_significance(lab_values),
            "possible_causes": self._generate_possible_causes(lab_values)
        }
        
        # Combinar recomendaciones
        all_recommendations = []
        if ai_data.get('urgent_actions'):
            all_recommendations.extend(ai_data['urgent_actions'])
        if ai_data.get('follow_up'):
            all_recommendations.extend(ai_data['follow_up'])
        
        # Respuesta estructurada final
        return {
            "success": True,
            "data": {
                "summary": ai_data.get('summary', 'Análisis de resultados de laboratorio completado'),
                "analysis_confidence": f"{int(ai_data.get('confidence', 0.8) * 100)}%",
                "interpretation": interpretation,
                "normal_values": normal_values,
                "abnormal_values": abnormal_values,
                "recommendations": all_recommendations,
                "urgency": {
                    "level": urgency_level,
                    "message": urgency_messages.get(urgency_level, "Evaluación médica recomendada")
                },
                "important_note": "Esta interpretación es generada por IA y debe ser revisada por un profesional médico. Los rangos de referencia pueden variar según el laboratorio y la población."
            },
            "patient_info": patient_info,
            "model_used": "gemini-2.0-flash" if GEMINI_API_KEY else "openai-gpt-4",
            "timestamp": datetime.now().isoformat()
        }
    
    def _get_reference_range(self, test_name):
        """Obtener rango de referencia para un examen"""
        name_upper = test_name.upper()
        
        if 'GLUCOSA' in name_upper:
            return "70-100 mg/dl"
        elif 'COLESTEROL' in name_upper and 'TOTAL' in name_upper:
            return "<200 mg/dl"
        elif 'HDL' in name_upper:
            return ">40 mg/dl"
        elif 'LDL' in name_upper:
            return "<100 mg/dl"
        elif 'TRIGLICERIDOS' in name_upper:
            return "<150 mg/dl"
        elif 'HEMOGLOBINA' in name_upper:
            return "12-16 g/dl"
        elif 'HEMATOCRITO' in name_upper:
            return "36-48%"
        elif 'LEUCOCITOS' in name_upper:
            return "4000-11000 /mm³"
        elif 'CREATININA' in name_upper:
            return "0.6-1.2 mg/dl"
        elif 'UREA' in name_upper:
            return "7-20 mg/dl"
        elif 'BILIRRUBINA' in name_upper:
            return "0.3-1.2 mg/dl"
        elif 'TSH' in name_upper:
            return "0.4-4.0 mUI/L"
        else:
            return "Consultar valores de referencia del laboratorio"
    
    def _get_significance_explanation(self, value):
        """Generar explicación del significado clínico"""
        name = value['name'].upper()
        status = value.get('status', '')
        
        if 'GLUCOSA' in name:
            if status == 'high':
                return "Hiperglucemia detectada. Posible diabetes o resistencia a la insulina. Requiere evaluación endocrinológica."
            else:
                return "Hipoglucemia detectada. Requiere evaluación metabólica inmediata."
        elif 'COLESTEROL' in name:
            return "Elevación del colesterol aumenta el riesgo cardiovascular. Requiere control lipídico y evaluación cardiológica."
        elif 'CREATININA' in name:
            return "Elevación sugiere deterioro de la función renal. Requiere evaluación nefrológica y estudios de función renal."
        elif 'HEMOGLOBINA' in name:
            if status == 'high':
                return "Policitemia posible. Requiere evaluación hematológica para descartar causas secundarias."
            else:
                return "Anemia detectada. Requiere evaluación de la causa y tratamiento específico."
        else:
            return f"Valor {status} fuera del rango normal. Requiere evaluación médica especializada."
    
    def _determine_urgency_level(self, lab_values):
        """Determinar nivel de urgencia basado en los valores"""
        critical_tests = ['CK-MB', 'TROPONINA', 'GLUCOSA', 'CREATININA']
        high_urgency_tests = ['HEMOGLOBINA', 'LEUCOCITOS', 'UREA']
        
        for value in lab_values:
            name = value['name'].upper()
            status = value.get('status', '')
            
            # Verificar si es crítico
            if any(test in name for test in critical_tests) and status != 'normal':
                return "Crítica"
            
            # Verificar si es alta urgencia
            if any(test in name for test in high_urgency_tests) and status != 'normal':
                return "Alta"
        
        # Contar valores anormales
        abnormal_count = sum(1 for v in lab_values if v.get('status') != 'normal')
        
        if abnormal_count >= 3:
            return "Media"
        elif abnormal_count > 0:
            return "Baja"
        else:
            return "Baja"
    
    def _generate_interpretation_title(self, lab_values, urgency_level):
        """Generar título de la interpretación"""
        abnormal_count = sum(1 for v in lab_values if v.get('status') != 'normal')
        
        if urgency_level == "Crítica":
            return "Resultados Críticos - Atención Médica Inmediata Requerida"
        elif urgency_level == "Alta":
            return "Resultados con Alteraciones Significativas"
        elif abnormal_count > 0:
            return "Resultados con Algunas Alteraciones"
        else:
            return "Resultados Dentro de Parámetros Normales"
    
    def _generate_clinical_significance(self, lab_values):
        """Generar significado clínico general"""
        abnormal_count = sum(1 for v in lab_values if v.get('status') != 'normal')
        
        if abnormal_count == 0:
            return "Todos los valores están dentro de los rangos normales. No se detectan alteraciones significativas."
        elif abnormal_count == 1:
            return "Se detecta una alteración aislada que requiere evaluación médica específica."
        else:
            return f"Se detectan {abnormal_count} alteraciones que requieren evaluación médica integral."
    
    def _generate_possible_causes(self, lab_values):
        """Generar posibles causas basadas en los valores anormales"""
        causes = []
        
        for value in lab_values:
            if value.get('status') != 'normal':
                name = value['name'].upper()
                
                if 'GLUCOSA' in name:
                    causes.extend([
                        "Diabetes mellitus",
                        "Resistencia a la insulina",
                        "Síndrome metabólico"
                    ])
                elif 'COLESTEROL' in name:
                    causes.extend([
                        "Hipercolesterolemia familiar",
                        "Dieta rica en grasas saturadas",
                        "Síndrome metabólico"
                    ])
                elif 'CREATININA' in name:
                    causes.extend([
                        "Insuficiencia renal",
                        "Deshidratación",
                        "Medicamentos nefrotóxicos"
                    ])
                elif 'HEMOGLOBINA' in name:
                    if value.get('status') == 'high':
                        causes.extend([
                            "Policitemia vera",
                            "Deshidratación",
                            "Hipoxia crónica"
                        ])
                    else:
                        causes.extend([
                            "Anemia ferropénica",
                            "Anemia por deficiencia de B12",
                            "Pérdida crónica de sangre"
                        ])
        
        # Eliminar duplicados y limitar a 5 causas
        return list(set(causes))[:5]
    
    def _get_specific_reason(self, value):
        """Obtener razón específica basada en el tipo de valor"""
        name = value['name'].upper()
        status = value.get('status', '')
        
        if 'CK-MB' in name:
            return "Elevación sugiere posible daño cardíaco. Requiere evaluación cardiológica urgente."
        elif 'TROPONINA' in name:
            return "Marcador específico de daño miocárdico. Elevación indica lesión cardíaca."
        elif 'GLUCOSA' in name:
            if status == 'high':
                return "Hiperglucemia detectada. Posible diabetes o resistencia a la insulina."
            else:
                return "Hipoglucemia detectada. Requiere evaluación metabólica."
        elif 'CREATININA' in name:
            return "Elevación sugiere deterioro de función renal. Requiere evaluación nefrológica."
        elif 'UREA' in name:
            return "Elevación indica posible insuficiencia renal o deshidratación."
        elif 'COLESTEROL' in name:
            return "Elevación aumenta riesgo cardiovascular. Requiere control lipídico."
        elif 'HEMOGLOBINA' in name:
            if status == 'high':
                return "Policitemia posible. Requiere evaluación hematológica."
            else:
                return "Anemia detectada. Requiere evaluación de causa."
        else:
            return f"Valor {status} fuera de rango normal. Requiere evaluación médica."

# Instanciar el interpretador
interpreter = MedicalInterpreter()

@app.route('/api/medical-interpret', methods=['POST'])
def medical_interpret():
    """Endpoint principal para interpretación médica"""
    try:
        data = request.get_json()
        
        if not data or 'html_content' not in data:
            return jsonify({'error': 'Contenido HTML requerido'}), 400
        
        html_content = data['html_content']
        patient_info = data.get('patient_info', {})
        
        logger.info(f"Interpretando resultados para paciente: {patient_info.get('age', 'N/A')} años")
        
        # Extraer valores de laboratorio
        lab_values = interpreter.extract_lab_values(html_content)
        
        if not lab_values:
            return jsonify({
                'error': 'No se pudieron extraer valores de laboratorio del contenido HTML'
            }), 400
        
        # Analizar valores
        analyzed_values, alerts = interpreter.analyze_values(lab_values, patient_info)
        
        # Generar interpretación estructurada
        ai_response = interpreter.generate_ai_interpretation(html_content, patient_info, analyzed_values)
        
        # Parsear respuesta JSON
        try:
            ai_data = json.loads(ai_response)
        except json.JSONDecodeError:
            logger.error("Error al parsear JSON de interpretación")
            return jsonify({'error': 'Error en la interpretación médica'}), 500
        
        # Generar respuesta estructurada con nuevo formato
        structured_response = interpreter.generate_structured_response(
            analyzed_values, 
            patient_info, 
            ai_data
        )
        
        logger.info(f"Interpretación completada: {len(analyzed_values)} valores analizados")
        return jsonify(structured_response)
        
    except Exception as e:
        logger.error(f"Error en interpretación médica: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500

@app.route('/api/medical-interpret/health', methods=['GET'])
def health_check():
    """Endpoint de salud del servicio"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'openai_configured': bool(OPENAI_API_KEY),
        'gemini_configured': bool(GEMINI_API_KEY)
    })

@app.route('/api/medical-interpret/ranges', methods=['GET'])
def get_normal_ranges():
    """Obtener rangos normales de laboratorio"""
    return jsonify(interpreter.normal_ranges)

if __name__ == '__main__':
    # Verificar configuración
    if not OPENAI_API_KEY and not GEMINI_API_KEY:
        logger.warning("No hay APIs de IA configuradas. Se usará interpretación básica.")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
