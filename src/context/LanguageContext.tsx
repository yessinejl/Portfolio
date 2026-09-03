'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'fr' | 'en' | 'ar';

export type TranslationKeys =
  | 'nav_home'
  | 'nav_skills'
  | 'nav_projects'
  | 'nav_contact'
  | 'hero_availability'
  | 'hero_hello'
  | 'hero_projects_cta'
  | 'hero_cv_cta'
  | 'hero_description'
  | 'hero_title_dev'
  | 'hero_title_creator'
  | 'hero_title_enthusiast'
  | 'hero_title_problem'
  | 'about_title'
  | 'skills_title'
  | 'skills_subtitle'
  | 'skills_expert'
  | 'skills_advanced'
  | 'skills_intermediate'
  | 'timeline_title'
  | 'timeline_academic'
  | 'timeline_present'
  | 'contact_title'
  | 'contact_subtitle'
  | 'contact_coordinates'
  | 'contact_email'
  | 'contact_phone'
  | 'contact_location'
  | 'contact_follow'
  | 'contact_send_msg'
  | 'contact_fullname'
  | 'contact_fullname_placeholder'
  | 'contact_email_label'
  | 'contact_email_placeholder'
  | 'contact_message_label'
  | 'contact_message_placeholder'
  | 'contact_submit_btn'
  | 'contact_submitting'
  | 'contact_success_title'
  | 'contact_success_desc'
  | 'contact_error_title'
  | 'contact_error_desc'
  | 'contact_error_name_min'
  | 'contact_error_email_invalid'
  | 'contact_error_msg_min'
  | 'projects_title'
  | 'projects_subtitle'
  | 'projects_none'
  | 'projects_none_admin'
  | 'projects_learn_more'
  | 'projects_all_tags'
  | 'proj_detail_back'
  | 'proj_detail_loading'
  | 'proj_detail_specs'
  | 'proj_detail_date'
  | 'proj_detail_tech'
  | 'proj_detail_visit'
  | 'proj_detail_source'
  | 'proj_detail_default_content';

const translations: Record<Language, Record<TranslationKeys, string>> = {
  fr: {
    nav_home: 'Accueil',
    nav_skills: 'Compétences',
    nav_projects: 'Projets',
    nav_contact: 'Contact',
    hero_availability: 'Disponible pour de nouvelles opportunités',
    hero_hello: 'Bonjour, je suis',
    hero_projects_cta: 'Voir mes projets',
    hero_cv_cta: 'Télécharger mon CV',
    hero_description: "Je conçois et développe des applications web et mobiles modernes, performantes et intelligentes. Spécialisé en Java (Spring Boot), React, Angular, Python (Django/Flask), Flutter et Symfony.",
    hero_title_dev: 'Développeur Web',
    hero_title_creator: "Créateur d'expériences",
    hero_title_enthusiast: 'Passionné de code',
    hero_title_problem: 'Problem Solver',
    about_title: 'À Propos de moi',
    skills_title: 'Mes Compétences',
    skills_subtitle: "Voici les technologies et méthodologies que j'utilise au quotidien pour donner vie à vos projets.",
    skills_expert: 'Expert',
    skills_advanced: 'Avancé',
    skills_intermediate: 'Intermédiaire',
    timeline_title: 'Expériences & Formations',
    timeline_academic: 'Projet Académique',
    timeline_present: 'Présent',
    contact_title: 'Me Contacter',
    contact_subtitle: "Un projet en tête ou simplement envie de discuter ? N'hésitez pas à m'envoyer un message.",
    contact_coordinates: 'Coordonnées',
    contact_email: 'Email',
    contact_phone: 'Téléphone',
    contact_location: 'Localisation',
    contact_follow: 'Suivez-moi',
    contact_send_msg: 'Envoyer un message',
    contact_fullname: 'Nom Complet',
    contact_fullname_placeholder: 'Ex: Jean Dupont',
    contact_email_label: 'Adresse Email',
    contact_email_placeholder: 'Ex: jean.dupont@email.com',
    contact_message_label: 'Votre Message',
    contact_message_placeholder: 'Expliquez brièvement votre projet ou votre demande...',
    contact_submit_btn: 'Envoyer le message',
    contact_submitting: 'Envoi en cours...',
    contact_success_title: 'Message envoyé avec succès !',
    contact_success_desc: 'Merci pour votre message. Je vous répondrai dans les plus brefs délais.',
    contact_error_title: "Erreur lors de l'envoi",
    contact_error_desc: "Une erreur s'est produite lors de l'insertion en base de données. Veuillez réessayer ou utiliser l'adresse e-mail directe.",
    contact_error_name_min: 'Le nom doit contenir au moins 2 caractères.',
    contact_error_email_invalid: 'Adresse email invalide.',
    contact_error_msg_min: 'Le message doit faire au moins 10 caractères.',
    projects_title: 'Mes Projets Récents',
    projects_subtitle: "Une sélection d'applications sur lesquelles j'ai travaillé, lues dynamiquement depuis la base de données.",
    projects_none: 'Aucun projet disponible pour le moment.',
    projects_none_admin: "Veuillez vous connecter à l'espace administration pour en ajouter de nouveaux.",
    projects_learn_more: 'En savoir plus',
    projects_all_tags: 'Tous',
    proj_detail_back: 'Retour aux projets',
    proj_detail_loading: 'Chargement du projet...',
    proj_detail_specs: 'Fiche technique',
    proj_detail_date: 'Date de réalisation',
    proj_detail_tech: 'Technologies',
    proj_detail_visit: 'Visiter le site',
    proj_detail_source: 'Code source sur GitHub',
    proj_detail_default_content: "Aucun détail supplémentaire n'a été spécifié pour ce projet. Il s'agit d'une démonstration construite avec une architecture propre intégrant les meilleures pratiques du développement web moderne.",
  },
  en: {
    nav_home: 'Home',
    nav_skills: 'Skills',
    nav_projects: 'Projects',
    nav_contact: 'Contact',
    hero_availability: 'Available for new opportunities',
    hero_hello: "Hello, I'm",
    hero_projects_cta: 'View my work',
    hero_cv_cta: 'Download Resume',
    hero_description: 'I design and develop modern, high-performance, and intelligent web & mobile applications. Specialized in Java (Spring Boot), React, Angular, Python (Django/Flask), Flutter, and Symfony.',
    hero_title_dev: 'Web Developer',
    hero_title_creator: 'Experience Creator',
    hero_title_enthusiast: 'Code Enthusiast',
    hero_title_problem: 'Problem Solver',
    about_title: 'About Me',
    skills_title: 'My Skills',
    skills_subtitle: 'Here are the technologies and methodologies I use daily to bring your projects to life.',
    skills_expert: 'Expert',
    skills_advanced: 'Advanced',
    skills_intermediate: 'Intermediate',
    timeline_title: 'Experience & Education',
    timeline_academic: 'Academic Project',
    timeline_present: 'Present',
    contact_title: 'Contact Me',
    contact_subtitle: 'Have a project in mind or just want to chat? Feel free to send me a message.',
    contact_coordinates: 'Contact Information',
    contact_email: 'Email',
    contact_phone: 'Phone',
    contact_location: 'Location',
    contact_follow: 'Follow Me',
    contact_send_msg: 'Send a Message',
    contact_fullname: 'Full Name',
    contact_fullname_placeholder: 'e.g. John Doe',
    contact_email_label: 'Email Address',
    contact_email_placeholder: 'e.g. john.doe@email.com',
    contact_message_label: 'Your Message',
    contact_message_placeholder: 'Briefly explain your project or request...',
    contact_submit_btn: 'Send Message',
    contact_submitting: 'Sending...',
    contact_success_title: 'Message sent successfully!',
    contact_success_desc: 'Thank you for your message. I will get back to you as soon as possible.',
    contact_error_title: 'Error sending message',
    contact_error_desc: 'An error occurred while saving to the database. Please try again or email me directly.',
    contact_error_name_min: 'Name must be at least 2 characters.',
    contact_error_email_invalid: 'Invalid email address.',
    contact_error_msg_min: 'Message must be at least 10 characters.',
    projects_title: 'My Recent Projects',
    projects_subtitle: "A selection of applications I've worked on, loaded dynamically from the database.",
    projects_none: 'No projects available at the moment.',
    projects_none_admin: 'Please log in to the admin panel to add new projects.',
    projects_learn_more: 'Learn more',
    projects_all_tags: 'All',
    proj_detail_back: 'Back to projects',
    proj_detail_loading: 'Loading project...',
    proj_detail_specs: 'Specifications',
    proj_detail_date: 'Date of completion',
    proj_detail_tech: 'Technologies',
    proj_detail_visit: 'Visit Site',
    proj_detail_source: 'Source Code on GitHub',
    proj_detail_default_content: 'No additional details have been specified for this project. It is a clean demonstration built using modern web best practices.',
  },
  ar: {
    nav_home: 'الرئيسية',
    nav_skills: 'المهارات',
    nav_projects: 'المشاريع',
    nav_contact: 'اتصل بي',
    hero_availability: 'متاح لفرص عمل جديدة',
    hero_hello: 'مرحباً، أنا',
    hero_projects_cta: 'عرض مشاريعي',
    hero_cv_cta: 'تحميل السيرة الذاتية',
    hero_description: 'أقوم بتصميم وتطوير تطبيقات ويب وموبايل حديثة، عالية الأداء وذكية. متخصص في Java (Spring Boot) و React و Angular و Python (Django/Flask) و Flutter و Symfony.',
    hero_title_dev: 'مطور ويب',
    hero_title_creator: 'صانع تجارب المستخدم',
    hero_title_enthusiast: 'شغوف بالبرمجة',
    hero_title_problem: 'محلل مشاكل برمجية',
    about_title: 'من أنا',
    skills_title: 'مهاراتي',
    skills_subtitle: 'هذه هي التقنيات والمنهجيات التي أستخدمها يومياً لتجسيد وتطوير مشاريعكم.',
    skills_expert: 'خبير',
    skills_advanced: 'متقدم',
    skills_intermediate: 'متوسط',
    timeline_title: 'الخبرات والتعليم',
    timeline_academic: 'مشروع أكاديمي',
    timeline_present: 'الحاضر',
    contact_title: 'اتصل بي',
    contact_subtitle: 'هل لديك مشروع في ذهنك أو تريد فقط التحدث؟ لا تتردد في إرسال رسالة لي.',
    contact_coordinates: 'معلومات الاتصال',
    contact_email: 'البريد الإلكتروني',
    contact_phone: 'الهاتف',
    contact_location: 'الموقع',
    contact_follow: 'تابعني على',
    contact_send_msg: 'إرسال رسالة',
    contact_fullname: 'الاسم الكامل',
    contact_fullname_placeholder: 'مثال: محمد أحمد',
    contact_email_label: 'البريد الإلكتروني',
    contact_email_placeholder: 'مثال: mohamed.ahmed@email.com',
    contact_message_label: 'رسالتك',
    contact_message_placeholder: 'اشرح باختصار مشروعك أو طلبك...',
    contact_submit_btn: 'إرسال الرسالة',
    contact_submitting: 'جاري الإرسال...',
    contact_success_title: 'تم إرسال الرسالة بنجاح!',
    contact_success_desc: 'شكراً على رسالتك. سأرد عليك في أقرب وقت ممكن.',
    contact_error_title: 'خطأ أثناء الإرسال',
    contact_error_desc: 'حدث خطأ أثناء حفظ الرسالة. يرجى المحاولة مرة أخرى أو الاتصال بي عبر البريد الإلكتروني المباشر.',
    contact_error_name_min: 'يجب أن يتكون الاسم من حرفين على الأقل.',
    contact_error_email_invalid: 'البريد الإلكتروني غير صالح.',
    contact_error_msg_min: 'يجب أن تتكون الرسالة من 10 أحرف على الأقل.',
    projects_title: 'مشاريعي الأخيرة',
    projects_subtitle: 'مجموعة مختارة من التطبيقات التي عملت عليها، يتم تحميلها ديناميكياً من قاعدة البيانات.',
    projects_none: 'لا توجد مشاريع متاحة في الوقت الحالي.',
    projects_none_admin: 'يرجى تسجيل الدخول إلى لوحة التحكم لإضافة مشاريع جديدة.',
    projects_learn_more: 'اقرأ المزيد',
    projects_all_tags: 'الكل',
    proj_detail_back: 'العودة للمشاريع',
    proj_detail_loading: 'جاري تحميل المشروع...',
    proj_detail_specs: 'البطاقة التقنية',
    proj_detail_date: 'تاريخ الإنجاز',
    proj_detail_tech: 'التقنيات المستخدمة',
    proj_detail_visit: 'زيارة الموقع',
    proj_detail_source: 'كود المصدر على GitHub',
    proj_detail_default_content: 'لم يتم تحديد تفاصيل إضافية لهذا المشروع. هذا عرض توضيحي تم بناؤه بأفضل الممارسات لتطوير الويب الحديث.',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKeys) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: (key) => key,
  isRTL: false,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'fr' || savedLang === 'en' || savedLang === 'ar')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  useEffect(() => {
    // Appliquer le sens d'écriture RTL/LTR et l'attribut lang sur l'élément <html>
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: TranslationKeys): string => {
    return translations[language][key] || translations['fr'][key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
