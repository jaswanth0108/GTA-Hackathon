document.addEventListener('DOMContentLoaded', () => {
    /* =====================================
       DYNAMIC REGISTRATION FORM
    ===================================== */
    const teamSizeSelect = document.getElementById('team-size');
    const dynamicMembersDiv = document.getElementById('dynamic-members');
    const registrationForm = document.getElementById('registration-form');
    const successMessage = document.getElementById('success-message');

    const branches = [
        "CSE", "CS", "CSE-AI", "ECE", "EEE", 
        "Mechanical", "Civil", "IT", "AI & DS", "CSE-DS"
    ];

    const generateBranchOptions = () => {
        return branches.map(b => `<option value="${b}">${b}</option>`).join('');
    };

    const getMemberHtml = (index) => {
        const isHead = index === 1;
        const title = isHead ? "Team Head (Member 1)" : `Member ${index}`;
        
        let html = `
            <div class="member-block">
                <div class="member-title">${title}</div>
                <div class="form-group">
                    <input type="text" id="member${index}-name" required placeholder=" ">
                    <label for="member${index}-name">Student Name</label>
                </div>
                <div class="form-group">
                    <select id="member${index}-branch" required>
                        <option value="" disabled selected>Select Branch</option>
                        ${generateBranchOptions()}
                    </select>
                </div>
                <div class="form-group">
                    <input type="email" id="member${index}-email" required placeholder=" ">
                    <label for="member${index}-email">Email ID</label>
                </div>
        `;

        if (isHead) {
            html += `
                <div class="form-group">
                    <input type="tel" id="head-phone" required pattern="[0-9]{10}" maxlength="10" oninput="this.value = this.value.replace(/[^0-9]/g, '')" placeholder=" ">
                    <label for="head-phone">Phone Number (10 digits)</label>
                </div>
                <div class="form-group">
                    <input type="text" id="head-college" required placeholder=" ">
                    <label for="head-college">College Name</label>
                </div>
            `;
        }

        html += `</div>`;
        return html;
    };

    // REPLACE THIS URL WITH YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxc5hHVjFbop84MqQQ0udRLOanuJvpR6sc2_tIZmhpEALJSnYHx94y71EwpF4Xtk18N/exec';

    teamSizeSelect.addEventListener('change', (e) => {
        const size = parseInt(e.target.value);
        dynamicMembersDiv.innerHTML = ''; // Clear existing
        
        for (let i = 1; i <= size; i++) {
            dynamicMembersDiv.insertAdjacentHTML('beforeend', getMemberHtml(i));
        }
    });

    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const proceedBtn = document.getElementById('proceed-btn');
    const backBtn = document.getElementById('back-btn');
    const paymentAmountSpan = document.getElementById('payment-amount');
    const receiptUpload = document.getElementById('receipt-upload');
    const fileNameDisplay = document.getElementById('file-name');
    const uploadTriggerBtn = document.getElementById('upload-trigger-btn');

    // Wire the button to open the file picker
    uploadTriggerBtn.addEventListener('click', () => {
        receiptUpload.click();
    });

    let base64Receipt = '';

    // Update file name and compress image on selection
    receiptUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            fileNameDisplay.textContent = '✔ ' + file.name;
            fileNameDisplay.style.color = '#00ffcc';
            
            // Read file and compress it to avoid Google Apps Script size limits
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                    } else {
                        if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    base64Receipt = canvas.toDataURL('image/jpeg', 0.7);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            fileNameDisplay.textContent = 'No file chosen';
            fileNameDisplay.style.color = 'rgba(255,255,255,0.6)';
            base64Receipt = '';
        }
    });

    // PROCEED TO PAYMENT
    proceedBtn.addEventListener('click', () => {
        // Validate ONLY step 1 fields
        const step1Inputs = step1.querySelectorAll('input[required], select[required]');
        let isValid = true;
        for (let input of step1Inputs) {
            if (!input.checkValidity()) {
                input.reportValidity();
                isValid = false;
                break;
            }
        }
        if (!isValid) return;

        const teamSize = parseInt(teamSizeSelect.value);
        if (isNaN(teamSize) || teamSize < 3 || teamSize > 4) {
            alert("Team size must be between 3 and 4 members.");
            return;
        }

        // Branch check: ensure not all members are from the exact same branch
        const branches = new Set();
        for (let i = 1; i <= teamSize; i++) {
            const branchSelect = document.getElementById(`member${i}-branch`);
            if (branchSelect && branchSelect.value) {
                branches.add(branchSelect.value);
            }
        }
        if (branches.size === 1) {
            alert("All team members cannot be from the same branch. Please ensure at least one member is from a different branch.");
            return;
        }

        // Calculate fee
        const amount = teamSize * 200;
        paymentAmountSpan.textContent = `₹${amount}/-`;

        // Transition to Step 2
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
    });

    // BACK BUTTON
    backBtn.addEventListener('click', () => {
        step2.classList.add('hidden');
        step1.classList.remove('hidden');
    });

    // FINAL SUBMISSION
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!base64Receipt) {
            alert("Please upload your paid receipt screenshot!");
            return;
        }

        const teamSize = parseInt(teamSizeSelect.value);
        const teamName = document.getElementById('team-name').value;
        const transactionId = document.getElementById('transaction-id').value;
        const members = [];

        for (let i = 1; i <= teamSize; i++) {
            const member = {
                name: document.getElementById(`member${i}-name`).value,
                branch: document.getElementById(`member${i}-branch`).value,
                email: document.getElementById(`member${i}-email`).value
            };
            if (i === 1) {
                member.phone = document.getElementById('head-phone').value;
                member.college = document.getElementById('head-college').value;
            }
            members.push(member);
        }

        const submitBtn = step2.querySelector('.submit-btn');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "UPLOADING RECEIPT...";
        submitBtn.disabled = true;

        // STEP 1: Upload image to ImgBB and get a permanent URL
        const IMGBB_API_KEY = '90b2c32210e08d366909197ec23b82f4';
        const imgbbForm = new FormData();
        // ImgBB expects base64 WITHOUT the "data:image/jpeg;base64," prefix
        imgbbForm.append('image', base64Receipt.split(',')[1]);
        imgbbForm.append('name', teamName + '_' + transactionId + '_receipt');

        fetch('https://api.imgbb.com/1/upload?key=' + IMGBB_API_KEY, {
            method: 'POST',
            body: imgbbForm
        })
        .then(res => res.json())
        .then(imgData => {
            if (!imgData.success) throw new Error("ImgBB upload failed");

            const receiptUrl = imgData.data.url;
            submitBtn.innerText = "SAVING DATA...";

            // STEP 2: Send all data + image URL to Google Apps Script
            const params = new URLSearchParams();
            params.append('teamName', teamName);
            params.append('teamSize', teamSize);
            params.append('amountPaid', teamSize * 200);
            params.append('transactionId', transactionId);
            params.append('members', JSON.stringify(members));
            params.append('receiptUrl', receiptUrl);

            return fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: params
            });
        })
        .then(() => {
            registrationForm.classList.add('hidden');
            successMessage.classList.remove('hidden');
        })
        .catch(err => {
            console.error("Submission error:", err);
            alert("Submission failed: " + err.message + "\nPlease check your internet connection and try again.");
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        });
    });
});
