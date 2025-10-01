import React, { useState, useEffect } from 'react';
import { Camera, Save, Download, Copy, FileText, Search, Trash2, Edit3 } from 'lucide-react';

const ULTRASOUND_TEMPLATES = {
  'Abdomen': {
    name: 'Abdominal Ultrasound',
    normal: `FINDINGS:
Liver: Normal size and echogenicity. No focal lesion.
Gallbladder: Normal size. No gallstone. No wall thickening.
Pancreas: Unremarkable within visualized portion.
Spleen: Normal size and echogenicity.
Kidneys: Both kidneys are normal in size. No hydronephrosis. No stone.
Urinary bladder: Unremarkable.
Mesenteric lymph nodes: Within normal limits.`,
    abnormal: [
      'Hepatomegaly',
      'Splenomegaly',
      'Mesenteric lymphadenopathy',
      'Ascites',
      'Cholecystitis',
      'Hydronephrosis',
      'Bowel wall thickening'
    ],
    impressions: {
      normal: 'Normal abdominal ultrasound. No significant abnormality detected.',
      abnormal: {
        'Hepatomegaly': 'Hepatomegaly noted. Suggest clinical correlation and follow-up.',
        'Splenomegaly': 'Splenomegaly identified. Recommend clinical correlation for underlying cause.',
        'Mesenteric lymphadenopathy': 'Mesenteric lymphadenopathy observed. Likely reactive in nature. Clinical correlation advised.',
        'Ascites': 'Ascites present. Suggest further evaluation for underlying etiology.',
        'Cholecystitis': 'Findings suggestive of cholecystitis. Recommend clinical correlation and appropriate management.',
        'Hydronephrosis': 'Hydronephrosis detected. Further urological evaluation recommended.',
        'Bowel wall thickening': 'Bowel wall thickening noted. Differential diagnosis includes enterocolitis. Clinical correlation suggested.'
      }
    }
  },
  'Liver': {
    name: 'Liver Ultrasound',
    normal: `FINDINGS:
Liver: Normal size (right lobe span: age-appropriate).
Echogenicity: Homogeneous and normal echotexture.
Portal vein: Normal caliber and flow.
Intrahepatic bile ducts: No dilatation.
Focal lesions: None identified.
Liver surface: Smooth.`,
    abnormal: [
      'Hepatomegaly',
      'Fatty liver',
      'Hepatic cyst',
      'Hemangioma',
      'Intrahepatic calcification',
      'Portal vein dilatation',
      'Intrahepatic duct dilatation'
    ],
    impressions: {
      normal: 'Normal hepatic ultrasound. No focal lesion or significant abnormality.',
      abnormal: {
        'Hepatomegaly': 'Hepatomegaly noted. Clinical correlation and follow-up recommended.',
        'Fatty liver': 'Diffusely increased hepatic echogenicity consistent with fatty liver. Suggest lifestyle modification and follow-up.',
        'Hepatic cyst': 'Simple hepatic cyst identified. Likely benign. Routine follow-up recommended.',
        'Hemangioma': 'Focal hepatic lesion suggestive of hemangioma. Follow-up imaging recommended for confirmation.',
        'Intrahepatic calcification': 'Intrahepatic calcification noted. Consider further evaluation if clinically indicated.',
        'Portal vein dilatation': 'Portal vein dilatation observed. Suggest correlation with clinical findings and laboratory data.',
        'Intrahepatic duct dilatation': 'Intrahepatic biliary dilatation detected. Further evaluation for biliary obstruction recommended.'
      }
    }
  },
  'IHPS': {
    name: 'Pyloric Stenosis (IHPS) Ultrasound',
    normal: `FINDINGS:
Pylorus: Visualized in normal position.
Pyloric muscle thickness: < 3mm (within normal limits)
Pyloric channel length: < 15mm (within normal limits)
Pyloric channel diameter: Normal
Peristalsis: Normal peristaltic activity observed.
Gastric emptying: Unremarkable.`,
    abnormal: [
      'IHPS positive (Muscle thickness ≥ 3mm, Channel length ≥ 15mm)',
      'Borderline findings',
      'Pylorospasm',
      'Gastric distension',
      'Reflux'
    ],
    impressions: {
      normal: 'Normal pyloric ultrasound. No evidence of infantile hypertrophic pyloric stenosis.',
      abnormal: {
        'IHPS positive (Muscle thickness ≥ 3mm, Channel length ≥ 15mm)': 'Findings diagnostic of infantile hypertrophic pyloric stenosis (IHPS). Surgical consultation recommended.',
        'Borderline findings': 'Borderline pyloric measurements. Suggest clinical correlation and repeat ultrasound if symptoms persist.',
        'Pylorospasm': 'Findings suggestive of pylorospasm rather than IHPS. Clinical correlation and conservative management recommended.',
        'Gastric distension': 'Gastric distension noted. Consider feeding pattern and clinical correlation.',
        'Reflux': 'Gastroesophageal reflux observed. Clinical management as appropriate.'
      }
    }
  },
  'Neck': {
    name: 'Neck Ultrasound (Neck Mass)',
    normal: `FINDINGS:
Subcutaneous tissue: Normal.
Cervical lymph nodes: Normal size and morphology.
Salivary glands: Both parotid and submandibular glands appear normal.
Thyroid gland: Normal size and echogenicity.
Vascular structures: Unremarkable.
No discrete mass lesion identified.`,
    abnormal: [
      'Reactive lymphadenopathy',
      'Lymphadenopathy with atypical features',
      'Thyroglossal duct cyst',
      'Branchial cleft cyst',
      'Lymphangioma/Cystic hygroma',
      'Sebaceous cyst',
      'Abscess',
      'Hemangioma'
    ],
    impressions: {
      normal: 'Normal neck ultrasound. No pathologic mass or lymphadenopathy identified.',
      abnormal: {
        'Reactive lymphadenopathy': 'Reactive cervical lymphadenopathy. Likely benign reactive process. Follow-up as clinically indicated.',
        'Lymphadenopathy with atypical features': 'Cervical lymphadenopathy with atypical sonographic features. Further evaluation recommended.',
        'Thyroglossal duct cyst': 'Midline neck cyst consistent with thyroglossal duct cyst. Surgical consultation recommended if symptomatic.',
        'Branchial cleft cyst': 'Findings consistent with branchial cleft cyst. Surgical evaluation recommended.',
        'Lymphangioma/Cystic hygroma': 'Cystic neck mass suggestive of lymphangioma/cystic hygroma. Surgical consultation recommended.',
        'Sebaceous cyst': 'Sebaceous cyst identified. Conservative management or excision as clinically indicated.',
        'Abscess': 'Findings suggestive of neck abscess. Recommend immediate clinical correlation and appropriate antibiotic therapy or drainage.',
        'Hemangioma': 'Vascular lesion consistent with hemangioma. Follow-up and clinical management as appropriate.'
      }
    }
  },
  'Torticollis': {
    name: 'Torticollis Ultrasound (SCM)',
    normal: `FINDINGS:
Sternocleidomastoid muscle (SCM): Bilaterally symmetric thickness and echogenicity.
No intramuscular mass identified.
No evidence of fibrosis.
Surrounding soft tissue: Normal.`,
    abnormal: [
      'SCM pseudotumor',
      'SCM hypertrophy and asymmetry',
      'SCM fibrosis',
      'SCM calcification',
      'SCM hematoma'
    ],
    impressions: {
      normal: 'Normal bilateral sternocleidomastoid muscles. No evidence of pseudotumor or fibrosis.',
      abnormal: {
        'SCM pseudotumor': 'SCM pseudotumor identified. Typical finding in congenital muscular torticollis. Physical therapy recommended.',
        'SCM hypertrophy and asymmetry': 'Asymmetric SCM thickness noted. Consistent with muscular torticollis. Physical therapy advised.',
        'SCM fibrosis': 'SCM fibrosis detected. May require intensive physical therapy or surgical consultation if severe.',
        'SCM calcification': 'Calcification within SCM noted. Follow-up and clinical correlation recommended.',
        'SCM hematoma': 'SCM hematoma identified. Conservative management with follow-up imaging recommended.'
      }
    }
  },
  'NeonatalSpine': {
    name: 'Neonatal Spine Ultrasound',
    normal: `FINDINGS:
Spinal cord: Normal position. Conus medullaris terminates at normal level (L1-L2).
Central canal: Normal.
Spinal canal: Normal configuration.
Posterior elements: Intact closure.
Soft tissue: Unremarkable.
No abnormal mass or cyst identified.`,
    abnormal: [
      'Lipoma',
      'Tethered cord syndrome',
      'Syrinx',
      'Spina bifida',
      'Dermal sinus',
      'Meningocele',
      'Neural tube defect suspected'
    ],
    impressions: {
      normal: 'Normal neonatal spinal ultrasound. No evidence of spinal dysraphism or tethered cord.',
      abnormal: {
        'Lipoma': 'Intraspinal lipoma identified. MRI and neurosurgical consultation recommended.',
        'Tethered cord syndrome': 'Findings suggestive of tethered cord syndrome. MRI and neurosurgical evaluation recommended.',
        'Syrinx': 'Spinal cord syrinx detected. Further MRI evaluation and neurosurgical consultation advised.',
        'Spina bifida': 'Findings consistent with spina bifida. Comprehensive MRI and multidisciplinary evaluation recommended.',
        'Dermal sinus': 'Dermal sinus tract identified. MRI and neurosurgical consultation recommended to exclude intradural connection.',
        'Meningocele': 'Meningocele detected. Immediate neurosurgical consultation recommended.',
        'Neural tube defect suspected': 'Findings suspicious for neural tube defect. Urgent MRI and neurosurgical evaluation recommended.'
      }
    }
  },
  'NeonatalHead': {
    name: 'Neonatal Head Ultrasound',
    normal: `FINDINGS:
Ventricles: Normal size and configuration. No dilatation.
Brain parenchyma: Normal echogenicity.
Corpus callosum: Normally visualized.
Cerebellum: Unremarkable.
Extracerebral spaces: Normal.
No evidence of hemorrhage.
No periventricular leukomalacia.`,
    abnormal: [
      'Ventriculomegaly',
      'Intraventricular hemorrhage (IVH) - Grade I',
      'Intraventricular hemorrhage (IVH) - Grade II',
      'Intraventricular hemorrhage (IVH) - Grade III',
      'Intraventricular hemorrhage (IVH) - Grade IV',
      'Periventricular leukomalacia (PVL)',
      'Choroid plexus cyst',
      'Subependymal hemorrhage',
      'Subdural hemorrhage',
      'Agenesis of corpus callosum'
    ],
    impressions: {
      normal: 'Normal neonatal cranial ultrasound. No hemorrhage or parenchymal abnormality detected.',
      abnormal: {
        'Ventriculomegaly': 'Ventriculomegaly noted. Serial ultrasound follow-up recommended to monitor progression.',
        'Intraventricular hemorrhage (IVH) - Grade I': 'Grade I intraventricular hemorrhage (germinal matrix hemorrhage). Follow-up ultrasound recommended.',
        'Intraventricular hemorrhage (IVH) - Grade II': 'Grade II intraventricular hemorrhage without ventricular dilatation. Serial follow-up imaging advised.',
        'Intraventricular hemorrhage (IVH) - Grade III': 'Grade III intraventricular hemorrhage with ventricular dilatation. Close monitoring and neurosurgical consultation recommended.',
        'Intraventricular hemorrhage (IVH) - Grade IV': 'Grade IV intraventricular hemorrhage with parenchymal involvement. Urgent neurosurgical consultation recommended.',
        'Periventricular leukomalacia (PVL)': 'Findings consistent with periventricular leukomalacia. Serial ultrasound and developmental follow-up recommended.',
        'Choroid plexus cyst': 'Choroid plexus cyst identified. Usually benign finding. Follow-up imaging recommended to confirm resolution.',
        'Subependymal hemorrhage': 'Subependymal hemorrhage detected. Follow-up ultrasound recommended to monitor evolution.',
        'Subdural hemorrhage': 'Subdural hemorrhage identified. Neurosurgical consultation recommended. Consider further evaluation for etiology.',
        'Agenesis of corpus callosum': 'Findings suspicious for agenesis of corpus callosum. MRI confirmation and genetic consultation recommended.'
      }
    }
  },
  'PediatricEcho': {
    name: 'Pediatric Echocardiography',
    normal: `FINDINGS:
Heart size: Normal.
Ventricular function: Normal systolic function.
Atria: Normal size.
Ventricles: Normal size and wall thickness.
Valves: Mitral, tricuspid, aortic, and pulmonary valves are normal.
Ventricular septum: Intact. No defect.
Atrial septum: Intact. (PFO may be normal variant depending on age)
Great vessels: Normal arrangement and caliber.
No pericardial effusion.`,
    abnormal: [
      'Ventricular septal defect (VSD)',
      'Atrial septal defect (ASD)',
      'Patent ductus arteriosus (PDA)',
      'Pulmonary stenosis (PS)',
      'Aortic stenosis (AS)',
      'Mitral regurgitation (MR)',
      'Tricuspid regurgitation (TR)',
      'Ventricular hypertrophy',
      'Pericardial effusion',
      'Cardiomyopathy suspected'
    ],
    impressions: {
      normal: 'Normal pediatric echocardiogram. No structural heart disease or functional abnormality detected.',
      abnormal: {
        'Ventricular septal defect (VSD)': 'Ventricular septal defect identified. Cardiology follow-up recommended for size assessment and hemodynamic significance.',
        'Atrial septal defect (ASD)': 'Atrial septal defect detected. Pediatric cardiology consultation recommended.',
        'Patent ductus arteriosus (PDA)': 'Patent ductus arteriosus present. Clinical correlation and cardiology evaluation recommended.',
        'Pulmonary stenosis (PS)': 'Pulmonary valve stenosis noted. Degree of stenosis assessment and cardiology follow-up recommended.',
        'Aortic stenosis (AS)': 'Aortic valve stenosis detected. Severity assessment and cardiology consultation recommended.',
        'Mitral regurgitation (MR)': 'Mitral regurgitation identified. Clinical correlation and cardiology follow-up advised.',
        'Tricuspid regurgitation (TR)': 'Tricuspid regurgitation noted. Assess for underlying etiology. Cardiology follow-up recommended.',
        'Ventricular hypertrophy': 'Ventricular hypertrophy detected. Further evaluation for underlying cause recommended.',
        'Pericardial effusion': 'Pericardial effusion present. Clinical correlation and monitoring recommended. Consider etiology evaluation.',
        'Cardiomyopathy suspected': 'Findings suggestive of cardiomyopathy. Comprehensive cardiac evaluation and cardiology consultation strongly recommended.'
      }
    }
  },
  'Bowel': {
    name: 'Pediatric Bowel Ultrasound',
    normal: `FINDINGS:
Small bowel: Normal wall thickness (< 3mm). Normal peristalsis.
Large bowel: Normal wall thickness. Normal gas pattern.
Mesentery: Unremarkable.
Ascites: None.
Lymph nodes: Within normal limits.
Mesenteric blood flow: Normal.`,
    abnormal: [
      'Bowel wall thickening',
      'Enteritis/Colitis',
      'Intussusception suspected',
      'Mesenteric lymphadenitis',
      'Inflammatory bowel disease (IBD) suspected',
      'Bowel obstruction',
      'Ascites',
      'Increased mesenteric vascularity'
    ],
    impressions: {
      normal: 'Normal bowel ultrasound. No evidence of enterocolitis or obstruction.',
      abnormal: {
        'Bowel wall thickening': 'Bowel wall thickening identified. Differential diagnosis includes enterocolitis. Clinical correlation recommended.',
        'Enteritis/Colitis': 'Findings consistent with enterocolitis. Clinical correlation and appropriate management advised.',
        'Intussusception suspected': 'Suspicious findings for intussusception. Immediate clinical correlation and surgical consultation recommended.',
        'Mesenteric lymphadenitis': 'Mesenteric lymphadenitis noted. Likely reactive process. Clinical follow-up as indicated.',
        'Inflammatory bowel disease (IBD) suspected': 'Findings raise suspicion for inflammatory bowel disease. Further evaluation including colonoscopy recommended.',
        'Bowel obstruction': 'Findings suggestive of bowel obstruction. Immediate clinical correlation and surgical consultation recommended.',
        'Ascites': 'Ascites present. Further evaluation for underlying etiology recommended.',
        'Increased mesenteric vascularity': 'Increased mesenteric blood flow noted. Suggests inflammatory process. Clinical correlation advised.'
      }
    }
  },
  'Appendix': {
    name: 'Appendix Ultrasound',
    normal: `FINDINGS:
Appendix: Visualized and normal or not visualized (normal finding).
Appendiceal diameter: < 6mm (when visualized)
Appendiceal wall: Normal thickness.
Tenderness: No sonographic tenderness.
Peri-appendiceal fat: Normal.
Ascites: None.
Right lower quadrant lymph nodes: Within normal limits.`,
    abnormal: [
      'Acute appendicitis - definite',
      'Appendicitis suspected',
      'Perforated appendicitis suspected',
      'Periappendiceal abscess',
      'Appendicolith',
      'Right lower quadrant lymphadenitis',
      'Mesenteric lymphadenitis'
    ],
    impressions: {
      normal: 'Normal appendix ultrasound or non-visualized appendix (normal finding). No sonographic evidence of appendicitis.',
      abnormal: {
        'Acute appendicitis - definite': 'Findings diagnostic of acute appendicitis. Immediate surgical consultation recommended.',
        'Appendicitis suspected': 'Findings suspicious for appendicitis. Clinical correlation recommended. Consider CT for confirmation if clinically indicated.',
        'Perforated appendicitis suspected': 'Findings suggestive of perforated appendicitis. Urgent surgical consultation recommended.',
        'Periappendiceal abscess': 'Periappendiceal abscess identified. Surgical consultation and possible drainage recommended.',
        'Appendicolith': 'Appendicolith noted. Increased risk for appendicitis. Clinical correlation and close monitoring recommended.',
        'Right lower quadrant lymphadenitis': 'Right lower quadrant lymphadenopathy noted. May be reactive. Clinical correlation suggested.',
        'Mesenteric lymphadenitis': 'Mesenteric lymphadenitis identified. Likely reactive process. Conservative management with clinical follow-up.'
      }
    }
  },
  'KidneyBladder': {
    name: 'Kidney & Bladder Ultrasound',
    normal: `FINDINGS:
Right kidney: Normal size (age-appropriate length). Normal cortical echogenicity. No hydronephrosis.
Left kidney: Normal size (age-appropriate length). Normal cortical echogenicity. No hydronephrosis.
Pelvicalyceal system: No dilatation.
Ureters: No dilatation.
Urinary bladder: Normal size and wall thickness. No internal echoes.
Renal stones: None identified.
No evidence of vesicoureteral reflux.`,
    abnormal: [
      'Hydronephrosis - Grade I',
      'Hydronephrosis - Grade II',
      'Hydronephrosis - Grade III',
      'Hydronephrosis - Grade IV',
      'Renal stone',
      'Renal cyst',
      'Duplicated collecting system',
      'Bladder wall thickening',
      'Bladder debris',
      'Pelvicalyceal dilatation',
      'Hydroureter'
    ],
    impressions: {
      normal: 'Normal renal and bladder ultrasound. No hydronephrosis or stone identified.',
      abnormal: {
        'Hydronephrosis - Grade I': 'Mild (Grade I) hydronephrosis detected. Follow-up ultrasound recommended. Consider voiding cystourethrogram if persistent.',
        'Hydronephrosis - Grade II': 'Moderate (Grade II) hydronephrosis identified. Urological evaluation recommended.',
        'Hydronephrosis - Grade III': 'Severe (Grade III) hydronephrosis noted. Prompt urological consultation and further evaluation recommended.',
        'Hydronephrosis - Grade IV': 'Very severe (Grade IV) hydronephrosis detected. Urgent urological consultation recommended.',
        'Renal stone': 'Renal calculus identified. Urological evaluation and metabolic workup recommended.',
        'Renal cyst': 'Simple renal cyst noted. Likely benign. Follow-up imaging as clinically indicated.',
        'Duplicated collecting system': 'Duplicated pelvicalyceal system identified. Follow-up to assess for associated anomalies recommended.',
        'Bladder wall thickening': 'Bladder wall thickening noted. Consider urodynamic evaluation if clinically indicated.',
        'Bladder debris': 'Echogenic material within bladder. Clinical correlation recommended. Consider urinalysis.',
        'Pelvicalyceal dilatation': 'Pelvicalyceal dilatation detected. Further evaluation with follow-up imaging and possible urological consultation recommended.',
        'Hydroureter': 'Ureteral dilatation identified. Urological evaluation recommended to determine underlying cause.'
      }
    }
  },
  'Hip': {
    name: 'Hip Ultrasound (DDH)',
    normal: `FINDINGS:
Right hip: Normal anatomical structure. Graf classification Type I (α angle > 60°, β angle < 55°).
Femoral head: Normal position and morphology. No dislocation.
Acetabulum: Normal configuration and angle.
Left hip: Normal anatomical structure. Graf classification Type I (α angle > 60°, β angle < 55°).
Femoral head: Normal position and morphology. No dislocation.
Acetabulum: Normal configuration and angle.
Joint effusion: None.`,
    abnormal: [
      'Developmental dysplasia of the hip (DDH) - Graf Type IIa',
      'Developmental dysplasia of the hip (DDH) - Graf Type IIb',
      'Developmental dysplasia of the hip (DDH) - Graf Type IIc',
      'Developmental dysplasia of the hip (DDH) - Graf Type III',
      'Developmental dysplasia of the hip (DDH) - Graf Type IV',
      'Hip subluxation',
      'Hip dislocation',
      'Joint effusion',
      'Septic arthritis suspected'
    ],
    impressions: {
      normal: 'Normal bilateral hip ultrasound. No evidence of developmental dysplasia or dislocation.',
      abnormal: {
        'Developmental dysplasia of the hip (DDH) - Graf Type IIa': 'Graf Type IIa hip (physiologic immaturity). Follow-up ultrasound in 4-6 weeks recommended.',
        'Developmental dysplasia of the hip (DDH) - Graf Type IIb': 'Graf Type IIb hip (delayed ossification). Consider Pavlik harness or close monitoring. Orthopedic consultation recommended.',
        'Developmental dysplasia of the hip (DDH) - Graf Type IIc': 'Graf Type IIc hip (critical zone). Pavlik harness treatment recommended. Orthopedic consultation advised.',
        'Developmental dysplasia of the hip (DDH) - Graf Type III': 'Graf Type III hip (decentered hip). Immediate orthopedic consultation and treatment recommended.',
        'Developmental dysplasia of the hip (DDH) - Graf Type IV': 'Graf Type IV hip (dislocated hip). Urgent orthopedic consultation and treatment required.',
        'Hip subluxation': 'Hip subluxation identified. Orthopedic consultation and treatment planning recommended.',
        'Hip dislocation': 'Hip dislocation detected. Immediate orthopedic consultation and reduction required.',
        'Joint effusion': 'Hip joint effusion present. Clinical correlation recommended. Rule out septic arthritis if clinically indicated.',
        'Septic arthritis suspected': 'Findings concerning for septic arthritis. Immediate clinical correlation, joint aspiration, and antibiotic therapy recommended.'
      }
    }
  },
  'Hydrocele': {
    name: 'Scrotal Ultrasound (Hydrocele)',
    normal: `FINDINGS:
Right testis: Normal size and echogenicity. Normal vascularity.
Right epididymis: Unremarkable.
Right hemiscrotum: No hydrocele.
Left testis: Normal size and echogenicity. Normal vascularity.
Left epididymis: Unremarkable.
Left hemiscrotum: No hydrocele.
Inguinal region: No hernia identified.`,
    abnormal: [
      'Hydrocele - right',
      'Hydrocele - left',
      'Hydrocele - bilateral',
      'Communicating hydrocele',
      'Inguinal hernia',
      'Undescended testis suspected',
      'Epididymitis',
      'Testicular torsion suspected',
      'Testicular mass'
    ],
    impressions: {
      normal: 'Normal scrotal ultrasound. No hydrocele or testicular abnormality identified.',
      abnormal: {
        'Hydrocele - right': 'Right-sided hydrocele identified. Observation recommended. Surgical consultation if persistent or symptomatic.',
        'Hydrocele - left': 'Left-sided hydrocele identified. Observation recommended. Surgical consultation if persistent or symptomatic.',
        'Hydrocele - bilateral': 'Bilateral hydroceles present. Observation recommended. Surgical consultation if persistent or symptomatic.',
        'Communicating hydrocele': 'Communicating hydrocele suspected. Surgical consultation recommended due to associated inguinal hernia risk.',
        'Inguinal hernia': 'Inguinal hernia identified. Surgical consultation recommended.',
        'Undescended testis suspected': 'Testis not visualized in hemiscrotum. Undescended testis suspected. Further evaluation and surgical consultation recommended.',
        'Epididymitis': 'Findings consistent with epididymitis. Antibiotic therapy and clinical follow-up recommended.',
        'Testicular torsion suspected': 'Absent or decreased testicular blood flow. Findings highly concerning for testicular torsion. URGENT surgical consultation required.',
        'Testicular mass': 'Testicular mass identified. Urgent urological consultation and further evaluation with tumor markers recommended.'
      }
    }
  },
  'PelvicFemale': {
    name: 'Pediatric Pelvic Ultrasound (Female, Trans-abdominal)',
    normal: `FINDINGS:
Uterus: Age-appropriate size. Normal echogenicity.
Ovaries: Both ovaries visualized normally. Age-appropriate size.
Right ovary: Normal size and echogenicity. Physiologic follicles noted (age-appropriate).
Left ovary: Normal size and echogenicity. Physiologic follicles noted (age-appropriate).
Pouch of Douglas: No free fluid.
Urinary bladder: Unremarkable.
No mass lesion identified.`,
    abnormal: [
      'Ovarian cyst - right',
      'Ovarian cyst - left',
      'Ovarian cyst - bilateral',
      'Ovarian torsion suspected',
      'Ovarian mass',
      'Uterine anomaly suspected',
      'Pelvic free fluid',
      'Hydrometrocolpos',
      'Intra-abdominal mass'
    ],
    impressions: {
      normal: 'Normal pelvic ultrasound for age. No ovarian or uterine abnormality detected.',
      abnormal: {
        'Ovarian cyst - right': 'Right ovarian cyst identified. Follow-up ultrasound recommended to assess for resolution. Gynecology consultation if persistent or enlarging.',
        'Ovarian cyst - left': 'Left ovarian cyst identified. Follow-up ultrasound recommended to assess for resolution. Gynecology consultation if persistent or enlarging.',
        'Ovarian cyst - bilateral': 'Bilateral ovarian cysts noted. Follow-up ultrasound and hormonal evaluation may be indicated.',
        'Ovarian torsion suspected': 'Findings concerning for ovarian torsion including abnormal ovarian blood flow. URGENT gynecological consultation required.',
        'Ovarian mass': 'Ovarian mass detected. Further evaluation with MRI and gynecology/oncology consultation recommended.',
        'Uterine anomaly suspected': 'Findings suggestive of uterine anomaly. MRI for detailed evaluation recommended.',
        'Pelvic free fluid': 'Free fluid in pelvis. Clinical correlation recommended. Consider differential diagnosis based on clinical context.',
        'Hydrometrocolpos': 'Findings consistent with hydrometrocolpos. Gynecology consultation and further evaluation recommended.',
        'Intra-abdominal mass': 'Pelvic/abdominal mass identified. Further imaging and multidisciplinary consultation recommended.'
      }
    }
  },
  'Thyroid': {
    name: 'Thyroid Ultrasound',
    normal: `FINDINGS:
Thyroid size: Age-appropriate normal size.
Right lobe: Normal size and homogeneous echogenicity.
Left lobe: Normal size and homogeneous echogenicity.
Isthmus: Unremarkable.
Thyroid nodules: None identified.
Cervical lymph nodes: Within normal limits.
Vascularity: Normal.`,
    abnormal: [
      'Goiter',
      'Thyroid nodule',
      'Thyroiditis',
      'Thyroid cyst',
      'Cervical lymphadenopathy',
      'Thyroid calcification',
      'Increased thyroid vascularity',
      'Ectopic thyroid tissue'
    ],
    impressions: {
      normal: 'Normal thyroid ultrasound. No nodule or abnormal lymphadenopathy identified.',
      abnormal: {
        'Goiter': 'Diffuse thyroid enlargement (goiter) noted. Thyroid function tests and clinical correlation recommended.',
        'Thyroid nodule': 'Thyroid nodule identified. Further characterization with ultrasound features assessment recommended. Consider FNA if indicated by ACR TI-RADS criteria.',
        'Thyroiditis': 'Findings consistent with thyroiditis. Thyroid function tests and clinical correlation recommended.',
        'Thyroid cyst': 'Simple thyroid cyst noted. Routine follow-up recommended unless symptomatic.',
        'Cervical lymphadenopathy': 'Cervical lymphadenopathy identified. Clinical correlation and follow-up recommended. Consider further evaluation if persistent or atypical features present.',
        'Thyroid calcification': 'Thyroid calcification detected. Further evaluation with ultrasound characterization recommended to assess for malignancy risk.',
        'Increased thyroid vascularity': 'Increased thyroid vascularity noted. Suggestive of thyroiditis or hyperfunction. Thyroid function tests recommended.',
        'Ectopic thyroid tissue': 'Ectopic thyroid tissue identified. Thyroid function assessment and surgical consultation if symptomatic.'
      }
    }
  }
};

export default function PediatricUltrasoundReport() {
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    patientId: '',
    rrn: '', // Resident Registration Number (주민등록번호)
    age: '',
    gender: 'M',
    examDate: new Date().toISOString().split('T')[0]
  });

  // Parse Korean Resident Registration Number
  const parseRRN = (rrn) => {
    // Remove any non-digit characters
    const cleaned = rrn.replace(/\D/g, '');
    
    if (cleaned.length < 7) return null;
    
    // Extract birth date (YYMMDD)
    const yy = cleaned.substring(0, 2);
    const mm = cleaned.substring(2, 4);
    const dd = cleaned.substring(4, 6);
    
    // Extract gender digit
    const genderDigit = cleaned.substring(6, 7);
    
    // Determine century and gender
    let century;
    let gender;
    
    if (genderDigit === '1' || genderDigit === '2') {
      century = '19';
      gender = genderDigit === '1' ? 'M' : 'F';
    } else if (genderDigit === '3' || genderDigit === '4') {
      century = '20';
      gender = genderDigit === '3' ? 'M' : 'F';
    } else if (genderDigit === '5' || genderDigit === '6') {
      century = '18';
      gender = genderDigit === '5' ? 'M' : 'F';
    } else {
      return null;
    }
    
    const birthYear = parseInt(century + yy);
    const birthMonth = parseInt(mm);
    const birthDay = parseInt(dd);
    
    // Validate date
    if (birthMonth < 1 || birthMonth > 12 || birthDay < 1 || birthDay > 31) {
      return null;
    }
    
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    const today = new Date();
    
    // Calculate age
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
      months += 12;
    }
    
    if (today.getDate() < birthDate.getDate()) {
      months--;
    }
    
    // Format age for pediatric patients
    let ageString;
    if (years === 0) {
      ageString = `${months} months`;
    } else if (years < 2) {
      ageString = `${years} year ${months} months`;
    } else {
      ageString = `${years} years`;
    }
    
    return {
      gender: gender,
      age: ageString,
      birthDate: birthDate
    };
  };

  const handleRRNChange = (value) => {
    // Allow input with or without hyphen
    let formatted = value.replace(/\D/g, '');
    
    // Auto-format with hyphen
    if (formatted.length > 6) {
      formatted = formatted.substring(0, 6) + '-' + formatted.substring(6, 13);
    }
    
    setPatientInfo({...patientInfo, rrn: formatted});
    
    // Parse and auto-fill gender and age
    const parsed = parseRRN(value);
    if (parsed) {
      setPatientInfo(prev => ({
        ...prev,
        rrn: formatted,
        gender: parsed.gender,
        age: parsed.age
      }));
    }
  };
  
  const [selectedType, setSelectedType] = useState('');
  const [normalFindings, setNormalFindings] = useState('');
  const [selectedAbnormal, setSelectedAbnormal] = useState([]);
  const [additionalFindings, setAdditionalFindings] = useState('');
  const [impression, setImpression] = useState('');
  
  const [savedReports, setSavedReports] = useState([]);
  const [editingReport, setEditingReport] = useState(null);
  const [showSavedReports, setShowSavedReports] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ultrasoundReports');
    if (saved) {
      setSavedReports(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (selectedType && ULTRASOUND_TEMPLATES[selectedType]) {
      setNormalFindings(ULTRASOUND_TEMPLATES[selectedType].normal);
      updateImpression();
    }
  }, [selectedType]);

  useEffect(() => {
    updateImpression();
  }, [selectedAbnormal, selectedType]);

  const updateImpression = () => {
    if (!selectedType || !ULTRASOUND_TEMPLATES[selectedType]) return;

    const template = ULTRASOUND_TEMPLATES[selectedType];
    
    if (selectedAbnormal.length === 0) {
      setImpression(template.impressions.normal);
    } else {
      const impressionTexts = selectedAbnormal.map(abnormal => {
        return template.impressions.abnormal[abnormal] || `${abnormal} noted. Clinical correlation recommended.`;
      });
      setImpression(impressionTexts.join('\n\n'));
    }
  };

  const handleSaveReport = () => {
    const report = {
      id: editingReport?.id || Date.now().toString(),
      patientInfo,
      selectedType,
      normalFindings,
      selectedAbnormal,
      additionalFindings,
      impression,
      savedDate: new Date().toISOString()
    };

    let updatedReports;
    if (editingReport) {
      updatedReports = savedReports.map(r => r.id === editingReport.id ? report : r);
    } else {
      updatedReports = [report, ...savedReports];
    }

    setSavedReports(updatedReports);
    localStorage.setItem('ultrasoundReports', JSON.stringify(updatedReports));
    alert(editingReport ? 'Report updated successfully!' : 'Report saved successfully!');
    setEditingReport(null);
  };

  const handleLoadReport = (report) => {
    setPatientInfo(report.patientInfo);
    setSelectedType(report.selectedType);
    setNormalFindings(report.normalFindings);
    setSelectedAbnormal(report.selectedAbnormal);
    setAdditionalFindings(report.additionalFindings);
    setImpression(report.impression);
    setEditingReport(report);
    setShowSavedReports(false);
  };

  const handleDeleteReport = (id) => {
    if (confirm('Are you sure you want to delete this report?')) {
      const updatedReports = savedReports.filter(r => r.id !== id);
      setSavedReports(updatedReports);
      localStorage.setItem('ultrasoundReports', JSON.stringify(updatedReports));
    }
  };

  const generateReport = () => {
    let report = `PEDIATRIC ULTRASOUND REPORT\n${'='.repeat(70)}\n\n`;
    report += `Patient Name: ${patientInfo.name}\n`;
    report += `Patient ID: ${patientInfo.patientId}\n`;
    if (patientInfo.rrn) {
      report += `RRN: ${patientInfo.rrn}\n`;
    }
    report += `Age: ${patientInfo.age}\n`;
    report += `Gender: ${patientInfo.gender === 'M' ? 'Male' : 'Female'}\n`;
    report += `Exam Date: ${patientInfo.examDate}\n`;
    report += `Examination: ${ULTRASOUND_TEMPLATES[selectedType]?.name || selectedType}\n\n`;
    report += `${'='.repeat(70)}\n\n`;
    
    report += `${normalFindings}\n\n`;
    
    if (selectedAbnormal.length > 0) {
      report += `ABNORMAL FINDINGS:\n`;
      selectedAbnormal.forEach(abnormal => {
        report += `- ${abnormal}\n`;
      });
      report += `\n`;
    }
    
    if (additionalFindings.trim()) {
      report += `ADDITIONAL FINDINGS:\n${additionalFindings}\n\n`;
    }
    
    if (impression.trim()) {
      report += `IMPRESSION:\n${'-'.repeat(70)}\n${impression}\n`;
    }
    
    return report;
  };

  const handleCopyToClipboard = () => {
    const report = generateReport();
    navigator.clipboard.writeText(report);
    alert('Copied to clipboard!');
  };

  const handleDownloadPDF = async () => {
    if (!patientInfo.name || !selectedType) {
      alert('Please enter patient name and select examination type.');
      return;
    }

    const report = generateReport();
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    const fileName = `${patientInfo.examDate}_${patientInfo.name}_${ULTRASOUND_TEMPLATES[selectedType]?.name.replace(/\s+/g, '_')}.txt`;
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all fields?')) {
      setPatientInfo({
        name: '',
        patientId: '',
        rrn: '',
        age: '',
        gender: 'M',
        examDate: new Date().toISOString().split('T')[0]
      });
      setSelectedType('');
      setNormalFindings('');
      setSelectedAbnormal([]);
      setAdditionalFindings('');
      setImpression('');
      setEditingReport(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-xl">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Pediatric Ultrasound Report</h1>
                <p className="text-gray-500 text-sm mt-1">Professional Report Generator</p>
              </div>
            </div>
            <button
              onClick={() => setShowSavedReports(!showSavedReports)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
            >
              <FileText className="w-5 h-5" />
              Saved Reports ({savedReports.length})
            </button>
          </div>
        </div>

        {/* Saved Reports List */}
        {showSavedReports && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-indigo-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Saved Reports</h2>
            {savedReports.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No saved reports yet.</p>
            ) : (
              <div className="space-y-3">
                {savedReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">
                        {report.patientInfo.name} - {ULTRASOUND_TEMPLATES[report.selectedType]?.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {report.patientInfo.examDate} | Saved: {new Date(report.savedDate).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLoadReport(report)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Load Report"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Patient Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-6 bg-blue-500 rounded"></div>
            Patient Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
              <input
                type="text"
                value={patientInfo.name}
                onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
              <input
                type="text"
                value={patientInfo.patientId}
                onChange={(e) => setPatientInfo({...patientInfo, patientId: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="12345678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RRN (주민등록번호)
                <span className="text-xs text-gray-500 ml-2">Auto-fills Gender & Age</span>
              </label>
              <input
                type="text"
                value={patientInfo.rrn}
                onChange={(e) => handleRRNChange(e.target.value)}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                placeholder="YYMMDD-GXXXXXX"
                maxLength="14"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
                <span className="text-xs text-green-600 ml-2">✓ Auto-calculated</span>
              </label>
              <select
                value={patientInfo.gender}
                onChange={(e) => setPatientInfo({...patientInfo, gender: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
                <span className="text-xs text-green-600 ml-2">✓ Auto-calculated</span>
              </label>
              <input
                type="text"
                value={patientInfo.age}
                onChange={(e) => setPatientInfo({...patientInfo, age: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                placeholder="Calculated from RRN"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exam Date</label>
              <input
                type="date"
                value={patientInfo.examDate}
                onChange={(e) => setPatientInfo({...patientInfo, examDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Ultrasound Type Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-6 bg-indigo-500 rounded"></div>
            Examination Type
          </h2>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setSelectedAbnormal([]);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
          >
            <option value="">Select Examination Type</option>
            {Object.keys(ULTRASOUND_TEMPLATES).map((key) => (
              <option key={key} value={key}>
                {ULTRASOUND_TEMPLATES[key].name}
              </option>
            ))}
          </select>
        </div>

        {/* Findings */}
        {selectedType && (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-green-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-green-500 rounded"></div>
                Normal Findings
              </h2>
              <textarea
                value={normalFindings}
                onChange={(e) => setNormalFindings(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                rows="10"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-orange-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-orange-500 rounded"></div>
                Abnormal Findings (Select applicable)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ULTRASOUND_TEMPLATES[selectedType].abnormal.map((abnormal, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-orange-50 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={selectedAbnormal.includes(abnormal)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAbnormal([...selectedAbnormal, abnormal]);
                        } else {
                          setSelectedAbnormal(selectedAbnormal.filter(a => a !== abnormal));
                        }
                      }}
                      className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                    />
                    <span className="text-gray-700">{abnormal}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-purple-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-purple-500 rounded"></div>
                Additional Findings
              </h2>
              <textarea
                value={additionalFindings}
                onChange={(e) => setAdditionalFindings(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows="5"
                placeholder="Enter any additional findings here..."
              />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-red-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-red-500 rounded"></div>
                Impression (Auto-generated)
              </h2>
              <textarea
                value={impression}
                onChange={(e) => setImpression(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
                rows="6"
                placeholder="Professional impression will be auto-generated based on your selections. You can also edit manually."
              />
              <p className="text-sm text-gray-500 mt-2">
                💡 Impression is automatically generated based on selected abnormal findings. You can edit it manually if needed.
              </p>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleSaveReport}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedType || !patientInfo.name}
          >
            <Save className="w-5 h-5" />
            {editingReport ? 'Update Report' : 'Save Report'}
          </button>
          <button
            onClick={handleCopyToClipboard}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedType}
          >
            <Copy className="w-5 h-5" />
            Copy to Clipboard
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedType || !patientInfo.name}
          >
            <Download className="w-5 h-5" />
            Download Report
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition shadow-lg"
          >
            <Trash2 className="w-5 h-5" />
            Reset
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2025 Pediatric Ultrasound Report System</p>
          <p className="mt-1">This system is a tool to assist medical professionals.</p>
        </div>
      </div>
    </div>
  );
}