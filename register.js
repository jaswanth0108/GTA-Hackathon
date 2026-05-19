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
        `;

        if (isHead) {
            html += `
                <div class="form-group">
                    <input type="tel" id="head-phone" required pattern="[0-9]{10}" placeholder=" ">
                    <label for="head-phone">Phone Number (10 digits)</label>
                </div>
                <div class="form-group">
                    <input type="email" id="head-email" required placeholder=" ">
                    <label for="head-email">Email ID</label>
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
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzFOxS63EE8BDUBA9vZnx_S7fFSbIeTqzsZCIYc6DaK5HNgNn7K15Jtg-oT-PN06z9IzA/exec';

    teamSizeSelect.addEventListener('change', (e) => {
        const size = parseInt(e.target.value);
        dynamicMembersDiv.innerHTML = ''; // Clear existing
        
        for (let i = 1; i <= size; i++) {
            dynamicMembersDiv.insertAdjacentHTML('beforeend', getMemberHtml(i));
        }
    });

    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const teamSize = parseInt(teamSizeSelect.value);
        const teamName = document.getElementById('team-name').value;
        const members = [];

        for (let i = 1; i <= teamSize; i++) {
            const member = {
                name: document.getElementById(`member${i}-name`).value,
                branch: document.getElementById(`member${i}-branch`).value
            };

            if (i === 1) {
                member.phone = document.getElementById('head-phone').value;
                member.email = document.getElementById('head-email').value;
                member.college = document.getElementById('head-college').value;
            }

            members.push(member);
        }

        const payload = {
            teamName: teamName,
            teamSize: teamSize,
            members: members
        };

        const submitBtn = registrationForm.querySelector('.submit-btn');
        submitBtn.innerText = "SUBMITTING...";
        submitBtn.disabled = true;

        if (SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
            // Fallback for local testing if URL isn't set up yet
            console.log("Payload:", payload);
            setTimeout(() => {
                registrationForm.classList.add('hidden');
                successMessage.classList.remove('hidden');
            }, 1000);
            return;
        }

        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Avoid CORS preflight issues with Google Apps Script
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(() => {
            registrationForm.classList.add('hidden');
            successMessage.classList.remove('hidden');
        })
        .catch(err => {
            console.error("Error submitting form:", err);
            alert("Submission failed. Please check your internet connection.");
            submitBtn.innerText = "SUBMIT REGISTRATION";
            submitBtn.disabled = false;
        });
    });
});
