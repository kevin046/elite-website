<?php
// ... existing database connection code ...

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // ... existing code ...

    // Get postal code from the form
    $clientPostal = mysqli_real_escape_string($conn, $_POST['clientPostal']);

    // Update your SQL query to include postal code
    $sql = "INSERT INTO estimates (
        estimate_number, 
        client_name, 
        client_email, 
        client_phone, 
        client_street,
        client_city,
        client_postal,  // Added this line
        project_description,
        subtotal,
        discount_type,
        discount_amount,
        after_discount,
        tax,
        total,
        payment_method,
        second_payment_milestone,
        validity_days,
        created_at
    ) VALUES (
        '$estimateNumber',
        '$clientName',
        '$clientEmail',
        '$clientPhone',
        '$clientStreet',
        '$clientCity',
        '$clientPostal',  // Added this line
        '$projectDescription',
        '$subtotal',
        '$discountType',
        '$discountAmount',
        '$afterDiscount',
        '$tax',
        '$total',
        '$paymentMethod',
        '$secondPaymentMilestone',
        '$validityDays',
        NOW()
    )";

    // ... rest of your existing code ...
}
?> 