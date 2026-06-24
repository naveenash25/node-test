// validators/user.validator.js

export const validateCreateUser = async (User, data) => {

    const errors = [];
    const requiredFields = ['firstName', 'lastName', 'username', 'phone', 'password'];
    // Required fields
    requiredFields
    .forEach(field => {
        if (!data[field]?.trim()) {
            errors.push(`${field} is required`);
        }
    });

    // Email optional
    if (data.email) {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(data.email)) {
            errors.push('Invalid email format');
        }

        const emailExists = await User.exists({
            email: data.email
        });

        if (emailExists) {
            errors.push('Email already exists');
        }
    }

    // Username unique
    if (data.username) {

        const usernameExists = await User.exists({
            username: data.username
        });

        if (usernameExists) {
            errors.push('Username already exists');
        }
    }

    // Password validation
    if (data.password && data.password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }

    // Phone validation
    if (data.phone && data.phone.length < 10) {
        errors.push('Phone must be at least 10 digits');
    }

    return errors;
};

export const validateUpdateUser = async (
    User,
    existingUser,
    data
) => {

    const errors = [];

    const requiredFields = ['firstName', 'lastName', 'username', 'phone'];
    requiredFields
        .forEach(field => {
            if (!data[field]?.trim()) {
                errors.push(`${field} is required`);
            }
        });

    // Username changed?
    if (
        data.username &&
        data.username !== existingUser.username
    ) {

        const usernameExists = await User.exists({
            username: data.username
        });

        if (usernameExists) {
            errors.push('Username already exists');
        }
    }

    // Email changed?
    if (
        data.email &&
        data.email !== existingUser.email
    ) {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(data.email)) {
            errors.push('Invalid email format');
        }

        const emailExists = await User.exists({
            email: data.email
        });

        if (emailExists) {
            errors.push('Email already exists');
        }
    }

    if (
        data.password &&
        data.password.length < 6
    ) {
        errors.push('Password must be at least 6 characters');
    }

    return errors;
};