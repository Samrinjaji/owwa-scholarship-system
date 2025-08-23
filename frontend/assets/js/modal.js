// Modal functionality for OWWA Scholarship Management System

class ScholarModal {
    constructor() {
        this.modal = document.getElementById('addScholarModal2');
        this.form = null;
        this.isSubmitting = false;
        this.mode = 'add';
        this.editId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupFormValidation();
    }

    bindEvents() {
        // Add button click event
        const addBtn = document.querySelector('.add-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.openModal();
            });
        }

        // Modal close events
        if (this.modal) {
            // Close on overlay click
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                    this.closeModal();
                }
            });

            // Contact number input formatting
            const contactInput = this.modal.querySelector('input[name="contact_number"]');
            if (contactInput) {
                contactInput.addEventListener('focus', (e) => {
                    if (e.target.value.trim() === '') {
                        e.target.value = '+63';
                        // Put cursor at the end after setting value
                        setTimeout(() => {
                            e.target.selectionStart = e.target.selectionEnd = e.target.value.length;
                        }, 0);
                    }
                });

                contactInput.addEventListener('input', (e) => {
                    let val = e.target.value;

                    // If user deletes all input, don't auto-fill here — wait for focus event to add +63
                    if (val === '') {
                        return;
                    }

                    // If input doesn't start with '+63', add it once and keep the rest
                    if (!val.startsWith('+63')) {
                        val = '+63' + val.replace(/^(\+|0)*/, '');
                        e.target.value = val;
                    }

                    // Allow user to type digits only after +63
                    // Remove non-digit characters except the leading '+'
                    e.target.value = e.target.value[0] + e.target.value.slice(1).replace(/\D/g, '');
                });
            }
        }
    }

    openModal() {
        if (this.modal) {
            this.setMode('add');
            this.modal.classList.remove('hidden');
            this.clearForm();
            this.resetValidation();

            // Focus on first input
            const firstInput = this.modal.querySelector('input, select');
            if (firstInput) {
                firstInput.focus();
            }
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.add('hidden');
            this.clearForm();
            this.resetValidation();
        }
    }

    clearForm() {
        const inputs = this.modal.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.value = '';
            input.classList.remove('error');
        });

        // Clear any error messages
        const errorMessages = this.modal.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
    }

    resetValidation() {
        const inputs = this.modal.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.classList.remove('error');
        });
    }

    setupFormValidation() {
        const inputs = this.modal.querySelectorAll('input, select');

        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            // Remove error on input
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    input.classList.remove('error');
                    const errorMsg = input.parentNode.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required`;
        }

        // Specific field validations
        if (isValid && value) {
            switch (fieldName) {
                case 'contact_number':
                    if (!this.validatePhoneNumber(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number (e.g., +639123456789)';
                    }
                    break;
                case 'batch':
                    const year = parseInt(value);
                    if (year < 2020 || year > 2030) {
                        isValid = false;
                        errorMessage = 'Batch year must be between 2020 and 2030';
                    }
                    break;
                case 'last_name':
                case 'first_name':
                    if (value.length < 2) {
                        isValid = false;
                        errorMessage = `${this.getFieldLabel(fieldName)} must be at least 2 characters`;
                    }
                    break;
            }
        }

        // Apply validation result
        if (!isValid) {
            field.classList.add('error');
            this.showFieldError(field, errorMessage);
        } else {
            field.classList.remove('error');
            this.removeFieldError(field);
        }

        return isValid;
    }

    validatePhoneNumber(phone) {
        // Basic Philippine phone number validation
        const phoneRegex = /^\+63[0-9]{10}$/;
        return phoneRegex.test(phone);
    }

    getFieldLabel(fieldName) {
        const labels = {
            'last_name': 'Last Name',
            'first_name': 'First Name',
            'middle_name': 'Middle Name',
            'program': 'Program',
            'batch': 'Batch Year',
            'sex': 'Sex',
            'home_address': 'Home Address',
            'province': 'Province',
            'contact_number': 'Contact Number',
            'course': 'Course',
            'years': 'Years of Study',
            'year_level': 'Year Level',
            'school': 'School',
            'school_address': 'School Address',
            'remarks': 'Remarks',
            'bank_details': 'Bank Details',
            'parent_name': 'Parent/Guardian Name',
            'relationship': 'Relationship to OFW',
            'ofw_name': 'Name of OFW',
            'category': 'Category',
            'gender': 'Gender',
            'jobsite': 'Jobsite',
            'position': 'Position'
        };
        return labels[fieldName] || fieldName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    showFieldError(field, message) {
        // Remove existing error message
        this.removeFieldError(field);

        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message show';
        errorDiv.textContent = message;

        // Insert after the field
        field.parentNode.appendChild(errorDiv);
    }

    removeFieldError(field) {
        const errorMsg = field.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }

    validateForm() {
        const inputs = this.modal.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    getFormData() {
        const formData = {};
        const inputs = this.modal.querySelectorAll('input, select');

        inputs.forEach(input => {
            if (input.name) {
                formData[input.name] = input.value.trim();
            }
        });

        return formData;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    setLoading(loading) {
        this.isSubmitting = loading;
        const submitBtn = this.modal.querySelector('.submit-btn');
        const modal = this.modal.querySelector('.modal');

        if (loading) {
            submitBtn.disabled = true;
            submitBtn.textContent = this.mode === 'edit' ? 'Updating...' : 'Saving...';
            modal.classList.add('loading');
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = this.mode === 'edit' ? 'Update' : 'Save';
            modal.classList.remove('loading');
        }
    }

    async submitForm() {
        if (this.isSubmitting) return;

        // Validate form
        if (!this.validateForm()) {
            this.showNotification('Please fix the errors in the form', 'warning');
            return;
        }

        this.setLoading(true);

        try {
            const formData = this.getFormData();

            let response;
            if (this.mode === 'edit' && this.editId) {
                response = await this.updateScholar({ id: this.editId, ...formData });
            } else {
                response = await this.saveScholar(formData);
            }

            if (response.success) {
                this.showNotification(this.mode === 'edit' ? 'Scholar updated successfully!' : 'Scholar added successfully!', 'success');
                this.closeModal();

                // Refresh the scholars table without reloading
                if (typeof fetchScholars === 'function') {
                    fetchScholars();
                }
            } else {
                this.showNotification(response.message || (this.mode === 'edit' ? 'Failed to update scholar' : 'Failed to add scholar'), 'error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showNotification('An error occurred while saving the scholar', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    async saveScholar(data) {
        try {
            const response = await fetch('../backend/scholars_create.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            throw new Error('Network error: ' + error.message);
        }
    }

    async updateScholar(data) {
        try {
            const response = await fetch('../backend/update_scholar.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            throw new Error('Network error: ' + error.message);
        }
    }

    setMode(mode) {
        this.mode = mode === 'edit' ? 'edit' : 'add';
        const header = this.modal.querySelector('.modal-header h2');
        const submitBtn = this.modal.querySelector('.submit-btn');
        if (header) {
            if (this.mode === 'edit') {
                header.innerHTML = '<i data-lucide="user-plus" class="icon"></i> Edit Scholar Record';
            } else {
                header.innerHTML = '<i data-lucide="user-plus" class="icon"></i> Add Scholar Record';
            }
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
        if (submitBtn) {
            submitBtn.textContent = this.mode === 'edit' ? 'Update' : 'Save';
        }
    }

    openForEdit(scholar) {
        if (!this.modal) return;
        this.setMode('edit');
        this.editId = scholar.id;
        this.modal.classList.remove('hidden');
        this.resetValidation();
        this.prefillForm(scholar);
        const firstInput = this.modal.querySelector('input, select');
        if (firstInput) firstInput.focus();
    }

    prefillForm(data) {
        const setValue = (name, value) => {
            const el = this.modal.querySelector(`[name="${name}"]`);
            if (!el) return;
            if (el.tagName.toLowerCase() === 'select') {
                // If option not present, append it
                const exists = Array.from(el.options).some(opt => opt.value === (value ?? ''));
                if (!exists && value !== undefined && value !== null && value !== '') {
                    const opt = document.createElement('option');
                    opt.value = value;
                    opt.textContent = value;
                    el.appendChild(opt);
                }
                el.value = value ?? '';
            } else {
                el.value = value ?? '';
            }
        };

        setValue('last_name', data.last_name);
        setValue('first_name', data.first_name);
        setValue('middle_name', data.middle_name);
        setValue('program', data.program);
        setValue('batch', data.batch);
        setValue('birth_date', data.birth_date);
        setValue('sex', data.sex);
        setValue('home_address', data.home_address);
        setValue('province', data.province);
        setValue('contact_number', data.contact_number);
        setValue('course', data.course);
        setValue('years', data.years);
        setValue('year_level', data.year_level);
        setValue('school', data.school);
        setValue('school_address', data.school_address);
        setValue('remarks', data.remarks);
        setValue('bank_details', data.bank_details);
        setValue('parent_name', data.parent_name);
        setValue('relationship', data.relationship);
        setValue('ofw_name', data.ofw_name);
        setValue('category', data.category);
        setValue('gender', data.gender);
        setValue('jobsite', data.jobsite);
        setValue('position', data.position);
    }
}

// Initialize modal when DOM is loaded
let scholarModal;

document.addEventListener('DOMContentLoaded', () => {
    scholarModal = new ScholarModal();
    window.scholarModal = scholarModal;
});

// Global functions for modal control
function openAddScholarModal() {
    if (scholarModal) {
        scholarModal.openModal();
    }
}

function closeAddScholarModal2() {
    if (scholarModal) {
        scholarModal.closeModal();
    }
}

function submitScholarForm() {
    if (scholarModal) {
        scholarModal.submitForm();
    }
}

// Add notification styles if not already present
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification {
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10001;
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideInRight 0.3s ease-out;
        }

        .notification-success {
            background-color: #10b981;
            border-left: 4px solid #059669;
        }

        .notification-error {
            background-color: #ef4444;
            border-left: 4px solid #dc2626;
        }

        .notification-warning {
            background-color: #f59e0b;
            border-left: 4px solid #d97706;
        }

        .notification-info {
            background-color: #3b82f6;
            border-left: 4px solid #2563eb;
        }

        .notification button {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            margin-left: auto;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .notification button:hover {
            opacity: 0.8;
        }

        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}