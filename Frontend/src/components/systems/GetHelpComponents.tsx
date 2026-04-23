import React, { useState } from "react";
// Multilingual content for the help page
const helpContent = {
  vi: {
    title: "Hướng Dẫn Sử Dụng Hệ Thống Quản Lý Nhân Sự Nội Bộ",
    language: "Ngôn ngữ",
    sections: [
      {
        heading: "1. Quản Lý Thông Tin Nhân Viên",
        color: "text-blue-600",
        desc: "Phần này cho phép quản lý toàn bộ thông tin nhân viên, bao gồm hồ sơ cá nhân, phòng ban, hợp đồng lao động và avatar.",
        items: [
          {
            label: "Xem danh sách nhân viên",
            desc: 'Truy cập menu "Thông tin nhân viên" để xem danh sách tất cả nhân viên với thông tin cơ bản như tên, phòng ban, vị trí.',
          },
          {
            label: "Thêm nhân viên mới",
            desc: 'Nhấn nút "Thêm nhân viên", điền đầy đủ thông tin cá nhân, chọn phòng ban và upload avatar nếu có.',
          },
          {
            label: "Cập nhật thông tin",
            desc: 'Chọn nhân viên từ danh sách, nhấn "Chỉnh sửa" để thay đổi thông tin cá nhân, phòng ban hoặc hợp đồng.',
          },
          {
            label: "Quản lý hợp đồng",
            desc: "Upload và xem file hợp đồng lao động cho từng nhân viên.",
          },
          {
            label: "Xóa nhân viên",
            desc: "Chỉ quản trị viên có quyền xóa nhân viên sau khi xác nhận.",
          },
          {
            label: "Tìm kiếm và lọc",
            desc: "Sử dụng thanh tìm kiếm để lọc theo tên, phòng ban hoặc mã nhân viên.",
          },
        ],
      },
      {
        heading: "2. Quản Lý Lương",
        color: "text-green-600",
        desc: "Hệ thống quản lý lương toàn diện bao gồm lương cơ bản, phụ cấp, khấu trừ, giờ làm việc và bảng lương cuối tháng.",
        items: [
          {
            label: "Lương cơ bản",
            desc: "Thiết lập và cập nhật lương cơ bản cho từng nhân viên.",
          },
          {
            label: "Phụ cấp",
            desc: "Quản lý các khoản phụ cấp như phụ cấp chức vụ, khu vực, thưởng.",
          },
          {
            label: "Khấu trừ",
            desc: "Ghi nhận các khoản khấu trừ như bảo hiểm, thuế thu nhập cá nhân.",
          },
          {
            label: "Giờ làm việc",
            desc: "Theo dõi và ghi nhận số giờ làm việc thực tế hàng ngày/tháng.",
          },
          {
            label: "Tính lương tự động",
            desc: "Hệ thống tự động tính lương: Lương cơ bản + Phụ cấp - Khấu trừ + (Giờ làm × Lương giờ).",
          },
          {
            label: "Bảng lương",
            desc: "Xem bảng lương chi tiết cho từng nhân viên hoặc toàn bộ phòng ban.",
          },
        ],
      },
      {
        heading: "3. Quản Lý Quyền và Vai Trò",
        color: "text-purple-600",
        desc: "Phân quyền chi tiết cho người dùng dựa trên vai trò để đảm bảo bảo mật và quản lý truy cập.",
        items: [
          {
            label: "Vai trò (Roles)",
            desc: "Tạo và quản lý các vai trò như Quản trị viên, Quản lý, Nhân viên.",
          },
          {
            label: "Quyền (Permissions)",
            desc: "Gán các quyền cụ thể cho từng vai trò.",
          },
          {
            label: "Tài khoản người dùng",
            desc: "Tạo tài khoản cho nhân viên với username/password và gán vai trò.",
          },
          {
            label: "Xác thực JWT",
            desc: "Hệ thống sử dụng JWT token để xác thực phiên làm việc.",
          },
          {
            label: "Đăng nhập/Đăng xuất",
            desc: "Sử dụng email/username và password để đăng nhập.",
          },
        ],
      },
    ],
    form: {
      heading: "Báo Cáo Lỗi",
      desc: "Nếu bạn phát hiện lỗi trong hệ thống, hãy báo cáo ngay để đội kỹ thuật xử lý kịp thời.",
      nameLabel: "Họ và Tên",
      emailLabel: "Email",
      errorTypeLabel: "Loại Lỗi / Module Bị Lỗi",
      errorTypeOptions: [
        "Quản lý nhân viên",
        "Quản lý lương",
        "Quản lý quyền",
        "Đăng nhập/Xác thực",
        "Upload file",
        "Tìm kiếm/Phân trang",
        "Báo cáo/Xuất dữ liệu",
        "Khác",
      ],
      priorityLabel: "Mức Độ Ưu Tiên",
      priorityOptions: ["Thấp", "Trung bình", "Cao", "Khẩn cấp"],
      descLabel: "Mô Tả Lỗi Chi Tiết",
      descPlaceholder:
        "Mô tả chi tiết lỗi bạn gặp phải, bao gồm các bước để tái tạo lỗi...",
      submitBtn: "Gửi Báo Cáo Lỗi",
      successMsg:
        "Cảm ơn bạn đã báo cáo lỗi. Chúng tôi sẽ xử lý sớm nhất có thể!",
      select: "Chọn loại lỗi",
    },
    languages: {
      vi: "Tiếng Việt",
      en: "Tiếng Anh",
      fr: "Tiếng Pháp",
      ru: "Tiếng Nga",
    },
  },
  en: {
    title: "HR Internal System User Guide",
    language: "Language",
    sections: [
      {
        heading: "1. Employee Information Management",
        color: "text-blue-600",
        desc: "This section manages all employee information, including personal profiles, departments, employment contracts, and avatars.",
        items: [
          {
            label: "View employee list",
            desc: 'Access the "Employee Info" menu to view all employees with basic info like name, department, and position.',
          },
          {
            label: "Add new employee",
            desc: 'Click "Add Employee", fill in personal details, select department, and upload avatar if available.',
          },
          {
            label: "Update information",
            desc: 'Select an employee from the list, click "Edit" to change personal info, department, or contract.',
          },
          {
            label: "Contract management",
            desc: "Upload and view employment contract files for each employee.",
          },
          {
            label: "Delete employee",
            desc: "Only administrators can delete employees after confirmation.",
          },
          {
            label: "Search and filter",
            desc: "Use the search bar to filter by name, department, or employee code.",
          },
        ],
      },
      {
        heading: "2. Salary Management",
        color: "text-green-600",
        desc: "Comprehensive salary management including base salary, allowances, deductions, work hours, and monthly payroll.",
        items: [
          {
            label: "Base salary",
            desc: "Set and update base salary for each employee based on position and experience.",
          },
          {
            label: "Allowances",
            desc: "Manage allowances such as position, regional, and bonus allowances.",
          },
          {
            label: "Deductions",
            desc: "Record deductions such as insurance and personal income tax.",
          },
          {
            label: "Work hours",
            desc: "Track and record actual work hours daily/monthly.",
          },
          {
            label: "Auto payroll calculation",
            desc: "Automatically calculates: Base Salary + Allowances - Deductions + (Hours × Hourly Rate).",
          },
          {
            label: "Payroll sheet",
            desc: "View detailed payroll for each employee or entire department.",
          },
        ],
      },
      {
        heading: "3. Roles & Permissions Management",
        color: "text-purple-600",
        desc: "Detailed user permissions based on roles to ensure security and access control.",
        items: [
          {
            label: "Roles",
            desc: "Create and manage roles such as Administrator, Manager, Employee.",
          },
          {
            label: "Permissions",
            desc: "Assign specific permissions to each role.",
          },
          {
            label: "User accounts",
            desc: "Create accounts for employees with username/password and assign roles.",
          },
          {
            label: "JWT authentication",
            desc: "The system uses JWT tokens for session authentication.",
          },
          {
            label: "Login/Logout",
            desc: "Use email/username and password to log in.",
          },
        ],
      },
    ],
    form: {
      heading: "Report an Issue",
      desc: "If you find a bug in the system, please report it immediately for the technical team to handle promptly.",
      nameLabel: "Full Name",
      emailLabel: "Email",
      errorTypeLabel: "Error Type / Affected Module",
      errorTypeOptions: [
        "Employee Management",
        "Salary Management",
        "Access Control",
        "Login/Authentication",
        "File Upload",
        "Search/Pagination",
        "Reports/Export",
        "Other",
      ],
      priorityLabel: "Priority Level",
      priorityOptions: ["Low", "Medium", "High", "Critical"],
      descLabel: "Detailed Description",
      descPlaceholder:
        "Describe the issue in detail, including steps to reproduce...",
      submitBtn: "Submit Report",
      successMsg:
        "Thank you for your report. We will handle it as soon as possible!",
      select: "Select error type",
    },
    languages: { vi: "Vietnamese", en: "English", fr: "French", ru: "Russian" },
  },
  fr: {
    title: "Guide d'utilisation du système HR",
    language: "Langue",
    sections: [
      {
        heading: "1. Gestion des informations employés",
        color: "text-blue-600",
        desc: "Cette section gère toutes les informations des employés, y compris les profils personnels, les départements et les contrats.",
        items: [
          {
            label: "Voir la liste des employés",
            desc: 'Accédez au menu "Infos employés" pour voir tous les employés.',
          },
          {
            label: "Ajouter un nouvel employé",
            desc: 'Cliquez sur "Ajouter", remplissez les informations et sélectionnez le département.',
          },
          {
            label: "Mettre à jour les informations",
            desc: 'Sélectionnez un employé et cliquez sur "Modifier" pour changer les informations.',
          },
          {
            label: "Gestion des contrats",
            desc: "Téléchargez et consultez les fichiers de contrat de travail.",
          },
          {
            label: "Supprimer un employé",
            desc: "Seuls les administrateurs peuvent supprimer des employés après confirmation.",
          },
          {
            label: "Rechercher et filtrer",
            desc: "Utilisez la barre de recherche pour filtrer par nom, département ou code.",
          },
        ],
      },
      {
        heading: "2. Gestion des salaires",
        color: "text-green-600",
        desc: "Gestion complète des salaires incluant le salaire de base, les allocations, les déductions et les heures de travail.",
        items: [
          {
            label: "Salaire de base",
            desc: "Définissez et mettez à jour le salaire de base pour chaque employé.",
          },
          {
            label: "Allocations",
            desc: "Gérez les allocations de poste, régionales et les primes.",
          },
          {
            label: "Déductions",
            desc: "Enregistrez les déductions comme l'assurance et l'impôt.",
          },
          {
            label: "Heures de travail",
            desc: "Suivez les heures de travail réelles quotidiennes/mensuelles.",
          },
          {
            label: "Calcul automatique",
            desc: "Calcule automatiquement: Salaire de base + Allocations - Déductions.",
          },
          {
            label: "Bulletin de paie",
            desc: "Consultez le bulletin de paie détaillé par employé ou département.",
          },
        ],
      },
      {
        heading: "3. Gestion des rôles et permissions",
        color: "text-purple-600",
        desc: "Permissions détaillées basées sur les rôles pour assurer la sécurité et le contrôle d'accès.",
        items: [
          {
            label: "Rôles",
            desc: "Créez et gérez des rôles comme Administrateur, Gestionnaire, Employé.",
          },
          {
            label: "Permissions",
            desc: "Attribuez des permissions spécifiques à chaque rôle.",
          },
          {
            label: "Comptes utilisateurs",
            desc: "Créez des comptes avec nom d'utilisateur/mot de passe et attribuez des rôles.",
          },
          {
            label: "Authentification JWT",
            desc: "Le système utilise des jetons JWT pour l'authentification.",
          },
          {
            label: "Connexion/Déconnexion",
            desc: "Utilisez email/utilisateur et mot de passe pour vous connecter.",
          },
        ],
      },
    ],
    form: {
      heading: "Signaler un problème",
      desc: "Si vous trouvez un bug, signalez-le immédiatement pour que l'équipe technique puisse le traiter rapidement.",
      nameLabel: "Nom complet",
      emailLabel: "Email",
      errorTypeLabel: "Type d'erreur / Module affecté",
      errorTypeOptions: [
        "Gestion employés",
        "Gestion salaires",
        "Contrôle accès",
        "Connexion/Auth",
        "Upload fichier",
        "Recherche/Pagination",
        "Rapports/Export",
        "Autre",
      ],
      priorityLabel: "Niveau de priorité",
      priorityOptions: ["Faible", "Moyen", "Élevé", "Critique"],
      descLabel: "Description détaillée",
      descPlaceholder:
        "Décrivez le problème en détail, y compris les étapes pour le reproduire...",
      submitBtn: "Soumettre le rapport",
      successMsg:
        "Merci pour votre rapport. Nous le traiterons dès que possible!",
      select: "Choisir le type d'erreur",
    },
    languages: { vi: "Vietnamien", en: "Anglais", fr: "Français", ru: "Russe" },
  },
  ru: {
    title: "Руководство пользователя HR-системы",
    language: "Язык",
    sections: [
      {
        heading: "1. Управление информацией о сотрудниках",
        color: "text-blue-600",
        desc: "Этот раздел управляет всей информацией о сотрудниках, включая личные профили, отделы и контракты.",
        items: [
          {
            label: "Просмотр списка сотрудников",
            desc: 'Перейдите в меню "Сотрудники" для просмотра всех сотрудников.',
          },
          {
            label: "Добавить нового сотрудника",
            desc: 'Нажмите "Добавить", заполните данные и выберите отдел.',
          },
          {
            label: "Обновить информацию",
            desc: 'Выберите сотрудника и нажмите "Редактировать" для изменения данных.',
          },
          {
            label: "Управление контрактами",
            desc: "Загрузите и просматривайте файлы трудовых договоров.",
          },
          {
            label: "Удалить сотрудника",
            desc: "Только администраторы могут удалять сотрудников после подтверждения.",
          },
          {
            label: "Поиск и фильтрация",
            desc: "Используйте строку поиска для фильтрации по имени, отделу или коду.",
          },
        ],
      },
      {
        heading: "2. Управление зарплатами",
        color: "text-green-600",
        desc: "Комплексное управление зарплатами: оклад, надбавки, вычеты, рабочие часы и расчётный лист.",
        items: [
          {
            label: "Базовый оклад",
            desc: "Установите и обновите базовый оклад для каждого сотрудника.",
          },
          {
            label: "Надбавки",
            desc: "Управляйте надбавками за должность, регион и премии.",
          },
          {
            label: "Вычеты",
            desc: "Записывайте вычеты: страховка и подоходный налог.",
          },
          {
            label: "Рабочие часы",
            desc: "Отслеживайте и записывайте фактические рабочие часы.",
          },
          {
            label: "Автоматический расчёт",
            desc: "Автоматически рассчитывает: Оклад + Надбавки - Вычеты.",
          },
          {
            label: "Расчётный лист",
            desc: "Просматривайте детальный расчётный лист по сотруднику или отделу.",
          },
        ],
      },
      {
        heading: "3. Управление ролями и правами",
        color: "text-purple-600",
        desc: "Детальные права пользователей на основе ролей для обеспечения безопасности и контроля доступа.",
        items: [
          {
            label: "Роли",
            desc: "Создавайте и управляйте ролями: Администратор, Руководитель, Сотрудник.",
          },
          { label: "Права", desc: "Назначайте конкретные права каждой роли." },
          {
            label: "Учётные записи",
            desc: "Создавайте аккаунты с именем пользователя/паролем и назначайте роли.",
          },
          {
            label: "JWT-аутентификация",
            desc: "Система использует JWT-токены для аутентификации сессий.",
          },
          {
            label: "Вход/Выход",
            desc: "Используйте email/пользователь и пароль для входа.",
          },
        ],
      },
    ],
    form: {
      heading: "Сообщить об ошибке",
      desc: "Если вы обнаружили ошибку, сообщите немедленно — команда технической поддержки устранит её как можно скорее.",
      nameLabel: "Полное имя",
      emailLabel: "Email",
      errorTypeLabel: "Тип ошибки / Затронутый модуль",
      errorTypeOptions: [
        "Управление сотрудниками",
        "Управление зарплатами",
        "Контроль доступа",
        "Вход/Аутентификация",
        "Загрузка файлов",
        "Поиск/Страницы",
        "Отчёты/Экспорт",
        "Другое",
      ],
      priorityLabel: "Уровень приоритета",
      priorityOptions: ["Низкий", "Средний", "Высокий", "Критический"],
      descLabel: "Подробное описание",
      descPlaceholder:
        "Опишите ошибку подробно, включая шаги для воспроизведения...",
      submitBtn: "Отправить отчёт",
      successMsg: "Спасибо за отчёт. Мы обработаем его как можно скорее!",
      select: "Выбрать тип ошибки",
    },
    languages: {
      vi: "Вьетнамский",
      en: "Английский",
      fr: "Французский",
      ru: "Русский",
    },
  },
};

import { useTranslation } from "react-i18next";

type HelpLang = "vi" | "en" | "fr" | "ru";

const GetHelpComponents = () => {
  const { i18n } = useTranslation();
  const localLang = (i18n.language as HelpLang) || "vi";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    errorType: "",
    priority: "",
    description: "",
  });

  const c = helpContent[localLang] || helpContent.vi;
  const priorityDefault = c.form.priorityOptions[1];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(c.form.successMsg);
    setFormData({
      name: "",
      email: "",
      errorType: "",
      priority: priorityDefault,
      description: "",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-card shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-foreground">
        {c.title}
      </h1>

      {c.sections.map((section, idx) => (
        <section key={idx} className="mb-8">
          <h2 className={`text-2xl font-semibold mb-4 ${section.color}`}>
            {section.heading}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-muted-foreground">
            {section.desc}
          </p>
          <ul className="list-disc list-inside mb-4 text-gray-600 dark:text-muted-foreground space-y-1">
            {section.items.map((item, i) => (
              <li key={i}>
                <strong>{item.label}:</strong> {item.desc}
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* Bug Report Form */}
      <section className="mt-12 p-6 bg-gray-50 dark:bg-muted/30 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">
          {c.form.heading}
        </h2>
        <p className="mb-4 text-gray-700 dark:text-muted-foreground">
          {c.form.desc}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="help-name"
              className="block text-sm font-medium text-gray-700 dark:text-foreground"
            >
              {c.form.nameLabel}
            </label>
            <input
              type="text"
              id="help-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-card dark:text-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="help-email"
              className="block text-sm font-medium text-gray-700 dark:text-foreground"
            >
              {c.form.emailLabel}
            </label>
            <input
              type="email"
              id="help-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-card dark:text-foreground"
            />
          </div>
          <div>
            <label
              htmlFor="help-errorType"
              className="block text-sm font-medium text-gray-700 dark:text-foreground"
            >
              {c.form.errorTypeLabel}
            </label>
            <select
              id="help-errorType"
              name="errorType"
              value={formData.errorType}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-card dark:text-foreground"
            >
              <option value="">{c.form.select}</option>
              {c.form.errorTypeOptions.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="help-priority"
              className="block text-sm font-medium text-gray-700 dark:text-foreground"
            >
              {c.form.priorityLabel}
            </label>
            <select
              id="help-priority"
              name="priority"
              value={formData.priority || priorityDefault}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-card dark:text-foreground"
            >
              {c.form.priorityOptions.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="help-description"
              className="block text-sm font-medium text-gray-700 dark:text-foreground"
            >
              {c.form.descLabel}
            </label>
            <textarea
              id="help-description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              required
              placeholder={c.form.descPlaceholder}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-card dark:text-foreground"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-destructive text-white py-2 px-4 rounded-md hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 transition-colors"
          >
            {c.form.submitBtn}
          </button>
        </form>
      </section>
    </div>
  );
};

export default GetHelpComponents;
