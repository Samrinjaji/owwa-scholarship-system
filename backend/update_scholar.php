<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

require_once __DIR__ . '/../includes/db_conn.php';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

$id = isset($input['id']) ? (int)$input['id'] : 0;
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid or missing scholar ID']);
    exit;
}

// Map and sanitize inputs with defaults
$program = trim($input['program'] ?? '');
$batch = isset($input['batch']) ? (int)$input['batch'] : null;
$last_name = trim($input['last_name'] ?? '');
$first_name = trim($input['first_name'] ?? '');
$middle_name = trim($input['middle_name'] ?? '');
$birth_date = trim($input['birth_date'] ?? '');
$sex = trim($input['sex'] ?? '');
$home_address = trim($input['home_address'] ?? '');
$province = trim($input['province'] ?? '');
$contact_number = trim($input['contact_number'] ?? '');
$course = trim($input['course'] ?? '');
$years = isset($input['years']) ? (int)$input['years'] : null;
$year_level = trim($input['year_level'] ?? '');
$school = trim($input['school'] ?? '');
$school_address = trim($input['school_address'] ?? '');
$remarks = trim($input['remarks'] ?? '');
$bank_details = trim($input['bank_details'] ?? '');
$parent_name = trim($input['parent_name'] ?? '');
$relationship = trim($input['relationship'] ?? '');
$ofw_name = trim($input['ofw_name'] ?? '');
$category = trim($input['category'] ?? '');
$gender = trim($input['gender'] ?? '');
$jobsite = trim($input['jobsite'] ?? '');
$position = trim($input['position'] ?? '');

// Basic required validation
$required = [
    'program' => $program,
    'batch' => $batch,
    'last_name' => $last_name,
    'first_name' => $first_name,
    'sex' => $sex,
    'home_address' => $home_address,
    'province' => $province,
    'contact_number' => $contact_number,
];

foreach ($required as $field => $value) {
    if ($value === '' || $value === null) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Field '$field' is required"]);
        exit;
    }
}

try {
    // Determine if birth_date column exists
    $hasBirthDate = false;
    if ($result = $conn->query("SHOW COLUMNS FROM scholars LIKE 'birth_date'")) {
        $hasBirthDate = $result->num_rows > 0;
        $result->close();
    }

    if ($hasBirthDate) {
        $sql = "UPDATE scholars SET 
            program = ?, batch = ?, last_name = ?, first_name = ?, middle_name = ?, birth_date = ?, sex = ?, home_address = ?, province = ?, contact_number = ?,
            course = ?, years = ?, year_level = ?, school = ?, school_address = ?, remarks = ?, bank_details = ?,
            parent_name = ?, relationship = ?, ofw_name = ?, category = ?, gender = ?, jobsite = ?, position = ?
            WHERE id = ?";

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $conn->error);
        }

        $stmt->bind_param(
            'sisssssssssissssssssssssi',
            $program,
            $batch,
            $last_name,
            $first_name,
            $middle_name,
            $birth_date,
            $sex,
            $home_address,
            $province,
            $contact_number,
            $course,
            $years,
            $year_level,
            $school,
            $school_address,
            $remarks,
            $bank_details,
            $parent_name,
            $relationship,
            $ofw_name,
            $category,
            $gender,
            $jobsite,
            $position,
            $id
        );
    } else {
        $sql = "UPDATE scholars SET 
            program = ?, batch = ?, last_name = ?, first_name = ?, middle_name = ?, sex = ?, home_address = ?, province = ?, contact_number = ?,
            course = ?, years = ?, year_level = ?, school = ?, school_address = ?, remarks = ?, bank_details = ?,
            parent_name = ?, relationship = ?, ofw_name = ?, category = ?, gender = ?, jobsite = ?, position = ?
            WHERE id = ?";

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $conn->error);
        }

        $stmt->bind_param(
            'sissssssssissssssssssssi',
            $program,
            $batch,
            $last_name,
            $first_name,
            $middle_name,
            $sex,
            $home_address,
            $province,
            $contact_number,
            $course,
            $years,
            $year_level,
            $school,
            $school_address,
            $remarks,
            $bank_details,
            $parent_name,
            $relationship,
            $ofw_name,
            $category,
            $gender,
            $jobsite,
            $position,
            $id
        );
    }

    if (!$stmt->execute()) {
        throw new Exception('Execute failed: ' . $stmt->error);
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}