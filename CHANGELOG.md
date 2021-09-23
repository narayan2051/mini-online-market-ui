## [Unreleased]

## HMIS v1.0.5 (Feb 2021 Release) [2021-02-10 to 2021-02-28]

### Added

- Custom React select component added.
- Add Medicine Component Added.
- Village Clinic IMCI 2-59 months AddMedicineList Component added for treatment and counselling.
- Fixed header implemented for following registers:
  - Mul dartaa register.
  - OPD register.
  - शिघ्र कुपोषणको एकिकृत व्यवस्थापन रजिस्टर
  - टी.डी. खोप सेवा
  - दुई–वर्षमुनिका बाल–बालिकाहरूको पोषण रजिस्टर
  - IMCI REGISTERS
    - Medicine unit  Vial and ampoule added
  - पिल्स, डिपो सेवा रजिष्टर
  - परिवार नियोजन स्थायी (बन्ध्याकरण) सेवा रजिस्टर
  - मातृ तथा नवशिशु स्वास्थ्य सेवा रजिष्टर
  - सुरक्षित गर्भपतन सेवा रजिष्टर
  - कुष्ठरोग उपचार रजिस्टर
  - औलो तथा कालाजार रोगको उपचार रजिष्टर
  - औलो, कुष्ठ र कालाजार रोगको प्रयोगशाला रजिष्टर
  - क्षयरोग प्रयोगशाला रजिष्टर
- Report Header component Added and implemented in following Report:
  - Hiv AIDS Report
  - महिला स्वास्थ्य स्वयंसेविका कार्यक्रम

### Changed

- npm packages are upgraded to latest versions.
- For following registers CustomSelect component is replaced with CustomReactSelect component:
  - Mul Dartaa Register.
  - OPD Register.
  - Matri Tatha Nawashishu Swasthya Sewa Register
  - Malaria Kalaazar Treatment Register
  - KuposhanEkikritWyawasthaapan Register
  - OutPatient Register
  - TDKhopSewa Register
  - MatriTathaNawajaatShishuSambandhaiWiwaran Register
- IMCI Add medicine list replaced with AddMedicineList Component.
- सेवा लिन आएको मिति(dartaaMiti) for registers in VillageClinicDetail is replaced with गाउँघर क्लिनिक सन्चालन भएको मिति/Village conducted date

### Removed
- Removed gentamycin from medicine list IMCI Below 2 month register

### Fixed

## [1.0.3] - 2021-01-31

### Added

- HIV-Aids report page added.
- File upload , delete functionality added in TB treatment register , Kustharog treatment register and Malaria Kalaazar treatment Register
- ELECTRON_BUILD.md file added inside docs folder which guides developers on creating desktop application from existing react app.
- Data Backup for offline app functionality added
- Search exception page added for super admin

### Changed

- Treatment and counselling section of IMCI above 2 month and below 2 month are made similar.
- Sidebar toggle state saved in the local storage so that user do not need to shrink and expand every time.
- Sidebar format changed in ROLE_USER.
- Auth token auto set added from set-cookie response headers and made token httponly.
- Added records from village clinic PillsDepo Register is not allowed to edit from main PillsOrDepo Register
- date picker updated to 0.0.8

### Removed

- Health service card removed from OPD register

### Fixed

- Duplicate key error fixed for sidebar items.
- Error message added in required field of TB Lab register

## [1.0.2] - 2020-10-16

### Added

- New Role ROLE_USER_PATHOLOGY added, and has access of users with pathology related services only.
- Admission register added for patient who needs to be admitted.(HMIS 8.1).
- Pathology setting page added and pathology admin can now save their custom normal values for pathology reports.
- Search Exception page added on admin panel.

### Changed

- Now, patient details page will be available for specific lab department. Lab admin can not access patient details page.
- User will get data only of tests and total amount colleted of the category they have access. For eg: pathology admin can not get data of Radiology or any other department.
- React upgraded to 17.0.1 and react scripts updated to 4.0.0.
- After upgrade React hook forms handleSubmit does not give values of fields with `disabled` attribute. Hence change breaking components are replaced with `InputProps={{ readOnly: boolean }}`.
- FCHV UI changed . Removed add new button. Default value added in column activities . Edit icon is added in each row for editing or adding new data.
- Pills Depo Registers removed instead pills depo details are saved independently.

### Removed

- Removed dynamic sewa category and added static ones.
- As Cotrim PI is banned, removed Cotrim PI from all registers and reports.

### Fixed

- small ui fixes.

## [1.0.1] - 2020-09-29

### Added

- Sewa category for bill sewa added. Now every sewa must have category.

### Changed

#### Billing Patient Report

- By default the default template is shown. After adding values to reports, the rows with values only be visible. Applied for all 7 default report templates.

### Removed

### Fixed

## 0.1.0 (May 26, 2020)

- Initial release

## 0.1.0 (Sept 21, 2020)

- Billing feature is added to module. Billing is inside the HMIS but is treated as a separate module. For now, it has no connections with HMIS Registers and reports.
