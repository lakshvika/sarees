document.addEventListener('DOMContentLoaded', () => {
    
    // --- VIEWS ---
    const loginView = document.getElementById('login-view');
    const otpLoginView = document.getElementById('otp-login-view');
    const registrationView = document.getElementById('registration-view');
    const profileDetailsView = document.getElementById('profile-details-view');
    const changePasswordView = document.getElementById('change-password-view');

    // --- FORMS & INPUTS ---
    // Login (Password)
    const loginPhone = document.getElementById('login-phone');
    const loginPassword = document.getElementById('login-password');
    const btnLoginPassword = document.getElementById('btn-login-password');
    
    // Login (OTP / Forgot Password)
    const otpLoginPhone = document.getElementById('otp-login-phone');
    const otpSection = document.getElementById('otp-section');
    const otpInput = document.getElementById('login-otp-input');
    const btnGetOtp = document.getElementById('btn-get-otp');
    const btnVerifyOtp = document.getElementById('btn-verify-otp');

    // Registration
    const regForm = document.getElementById('registration-form');
    const regPhone = document.getElementById('reg-phone');
    const regPassword = document.getElementById('reg-password');
    const btnRegisterSubmit = document.getElementById('btn-register-submit');

    // Change Password
    const changePasswordForm = document.getElementById('change-password-form');
    const cpOldPassword = document.getElementById('cp-old-password');
    const cpNewPassword = document.getElementById('cp-new-password');
    const cpConfirmPassword = document.getElementById('cp-confirm-password');

    // --- NAVIGATION LINKS ---
    document.getElementById('link-forgot-password').addEventListener('click', (e) => {
        e.preventDefault();
        showOtpLoginView();
    });
    document.getElementById('link-back-login').addEventListener('click', (e) => {
        e.preventDefault();
        showLoginView();
    });
    document.getElementById('link-to-register').addEventListener('click', (e) => {
        e.preventDefault();
        showRegistrationView();
    });
    document.getElementById('link-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        showLoginView();
    });
    document.getElementById('btn-logout').addEventListener('click', () => {
        localStorage.removeItem('rongtuliCurrentPhone');
        alert("Logged Out");
        location.reload(); 
    });
    document.getElementById('btn-change-password').addEventListener('click', () => {
        showChangePasswordView();
    });
    document.getElementById('link-back-profile').addEventListener('click', (e) => {
        e.preventDefault();
        const currentPhone = localStorage.getItem('rongtuliCurrentPhone');
        const user = getUserFromStorage(currentPhone);
        showProfileDetails(user);
    });

    // --- INITIAL CHECK ---
    const currentPhone = localStorage.getItem('rongtuliCurrentPhone');
    if (currentPhone) {
        const user = getUserFromStorage(currentPhone);
        if (user) {
            showProfileDetails(user);
        } else {
            showLoginView();
        }
    } else {
        showLoginView();
    }

    // --- HELPER: FORMAT PHONE ---
    function formatPhone(phone) {
        phone = phone.trim();
        if (!phone.startsWith('+')) {
            return "+91" + phone;
        }
        return phone;
    }

    // --- HELPER: RANDOM OTP GENERATOR ---
    function generateOTP() {
        const otp = Math.floor(1000 + Math.random() * 9000);
        return otp.toString();
    }

    // --- HELPER: VALIDATE PASSWORD ---
    function validatePassword(password) {
        if (password.length > 8) return "Password must be max 8 characters.";
        if (password.length < 4) return "Password is too short."; 
        if (!/[A-Z]/.test(password)) return "Need an uppercase letter.";
        if (!/[a-z]/.test(password)) return "Need a lowercase letter.";
        if (!/[0-9]/.test(password)) return "Need a number.";
        if (!/[^A-Za-z0-9]/.test(password)) return "Need a symbol.";
        return null;
    }

    // --- HELPER: LOCAL STORAGE DATABASE ---
    function getAllUsers() {
        const usersJSON = localStorage.getItem('rongtuliUsersDB');
        return usersJSON ? JSON.parse(usersJSON) : [];
    }

    function getUserFromStorage(phone) {
        const users = getAllUsers();
        return users.find(u => u.phone === phone);
    }

    function saveUserToStorage(userObj) {
        const users = getAllUsers();
        const existingIndex = users.findIndex(u => u.phone === userObj.phone);
        
        if (existingIndex > -1) {
            users[existingIndex] = userObj;
        } else {
            users.push(userObj);
        }
        localStorage.setItem('rongtuliUsersDB', JSON.stringify(users));
    }

    // --- VIEW SWITCHING ---
    function hideAllViews() {
        loginView.style.display = 'none';
        otpLoginView.style.display = 'none';
        registrationView.style.display = 'none';
        profileDetailsView.style.display = 'none';
        changePasswordView.style.display = 'none';
    }
    function showLoginView() { hideAllViews(); loginView.style.display = 'block'; }
    function showOtpLoginView() { hideAllViews(); otpLoginView.style.display = 'block'; }
    function showRegistrationView() { hideAllViews(); registrationView.style.display = 'block'; }
    function showChangePasswordView() { hideAllViews(); changePasswordView.style.display = 'block'; }
    function showProfileDetails(user) { 
        hideAllViews(); 
        profileDetailsView.style.display = 'block';
        
        document.getElementById('display-name').textContent = user.name || "User";
        document.getElementById('display-email').textContent = user.email || "";
        document.getElementById('display-phone').textContent = user.phone || "";
        document.getElementById('display-address').textContent = user.address || "";
        
        const nameStr = user.name || "U";
        document.getElementById('avatar-initials').textContent = nameStr.charAt(0).toUpperCase();
    }


    // --- 1. LOGIN WITH PASSWORD ---
    btnLoginPassword.addEventListener('click', (e) => {
        e.preventDefault();
        const phone = formatPhone(loginPhone.value);
        const password = loginPassword.value;

        if(phone.length < 13) return alert("Invalid Phone Number");
        if(!password) return alert("Enter Password");

        const user = getUserFromStorage(phone);

        if (user) {
            if (user.password === password) {
                alert("Login Successful!");
                localStorage.setItem('rongtuliCurrentPhone', phone);
                showProfileDetails(user);
            } else {
                alert("Incorrect Password.");
            }
        } else {
            alert("User not found. Please Register.");
        }
    });


    // --- 2. LOGIN WITH OTP (SIMULATED) ---
    btnGetOtp.addEventListener('click', (e) => {
        e.preventDefault();
        const phone = formatPhone(otpLoginPhone.value);
        
        const user = getUserFromStorage(phone);
        if (!user) {
            return alert("Phone number not registered. Please Register first.");
        }

        const randomOTP = generateOTP();
        localStorage.setItem('tempOTP', randomOTP);

        alert("OTP Sent to " + phone + ". \n\nYour Code is: " + randomOTP);
        
        otpSection.style.display = 'block';
        btnGetOtp.style.display = 'none';
        btnVerifyOtp.style.display = 'block';
    });

    btnVerifyOtp.addEventListener('click', (e) => {
        e.preventDefault();
        const userCode = otpInput.value;
        const realOTP = localStorage.getItem('tempOTP');
        
        if (userCode === realOTP) {
            const phone = formatPhone(otpLoginPhone.value);
            const user = getUserFromStorage(phone);
            
            localStorage.setItem('rongtuliCurrentPhone', phone);
            localStorage.removeItem('tempOTP');
            
            // Ask if they want to change password
            if(confirm("Phone Verified! Would you like to change your password now?")) {
                showChangePasswordView();
            } else {
                showProfileDetails(user);
            }
        } else {
            alert("Invalid OTP. Please check the code in the alert.");
        }
    });


    // --- 3. REGISTRATION ---
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const phone = formatPhone(regPhone.value);
        const password = document.getElementById('reg-password').value;
        
        const pwdError = validatePassword(password);
        if(pwdError) return alert(pwdError);

        if (getUserFromStorage(phone)) {
            return alert("User already exists! Please Login.");
        }

        // Generate Random OTP
        const randomOTP = generateOTP();
        const userEnteredOTP = prompt(`OTP Sent to ${phone}.\n\nYour Code is: ${randomOTP}\n\nEnter OTP to verify:`);

        if (userEnteredOTP === randomOTP) {
            const userData = {
                name: document.getElementById('reg-name').value,
                email: document.getElementById('reg-email').value,
                phone: phone,
                address: document.getElementById('reg-address').value,
                password: password,
                registeredAt: new Date().toISOString()
            };

            saveUserToStorage(userData);
            localStorage.setItem('rongtuliCurrentPhone', phone); 
            
            alert("Registration Successful!");
            showProfileDetails(userData);
        } else {
            alert("Invalid OTP. Registration Failed.");
        }
    });

    // --- 4. CHANGE PASSWORD ---
    changePasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentPhone = localStorage.getItem('rongtuliCurrentPhone');
        const user = getUserFromStorage(currentPhone);

        if (!user) {
            alert("Error: No user logged in.");
            showLoginView();
            return;
        }

        const oldPwd = cpOldPassword.value;
        const newPwd = cpNewPassword.value;
        const confirmPwd = cpConfirmPassword.value;

        if (oldPwd !== user.password) {
            return alert("Incorrect Old Password.");
        }

        const pwdError = validatePassword(newPwd);
        if(pwdError) return alert(pwdError);

        if (newPwd !== confirmPwd) {
            return alert("New Passwords do not match.");
        }

        // Update password
        user.password = newPwd;
        saveUserToStorage(user);
        
        alert("Password Updated Successfully!");
        changePasswordForm.reset();
        showProfileDetails(user);
    });

});