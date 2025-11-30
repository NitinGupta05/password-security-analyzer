# password-security-analyzer 🔐
An advanced "password strength and security analyzer" built using "HTML, CSS, and JavaScript".   It provides real-time feedback on password strength, entropy, policy compliance, and more — all in the browser.

Live link: https://nitingupta05.github.io/password-security-analyzer/
## Features
-  Live password strength meter with color-coded bar  
-  Real-time validation of:
  - Length requirements  
  - Uppercase & lowercase usage  
  - Numbers  
  - Special characters  
-  Username safety check (password should not contain username)  
-  Common password detection (warns on very weak, popular passwords)  
-  Entropy calculation (bits)  
-  Rough crack-time estimation (offline attack approximation)  
-  Password policy modes:
  - Basic (8+ chars)  
  - Strong (12+ with all character types)  
  - Very Strong (14+ with high complexity)  
-  Confirm password match indicator  
-  Copy-to-clipboard button  
-  Dark / light theme toggle  
-  All logic runs client-side in pure JavaScript

🧰 Tech Stack

- HTML5 – structure  
- CSS3 – layout, styling, dark/light themes  
- Vanilla JavaScript (ES6) – all logic, validation, and dynamic UI updates  

No frameworks or external libraries.

## 📁 Folder Structure

password-security-lab/
├── index.html      # Main page
├── style.css       # Styling
└── script.js       # Core logic

