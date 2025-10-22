<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo permitir método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Método no permitido'
    ]);
    exit();
}

// Incluir conexión a la base de datos
require_once '../db.php';

try {
    // Obtener datos del POST
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Datos JSON inválidos');
    }
    
    // Validar campos obligatorios
    if (!isset($input['usuario_id']) || !isset($input['torneo_id'])) {
        throw new Exception('Campos usuario_id y torneo_id son obligatorios');
    }
    
    $usuario_id = $input['usuario_id'];
    $torneo_id = $input['torneo_id'];
    
    // Verificar que el usuario existe
    $stmt = $pdo->prepare("SELECT id, admin FROM usuarios WHERE id = ?");
    $stmt->execute([$usuario_id]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$usuario) {
        throw new Exception('Usuario no encontrado');
    }
    
    // Verificar que el usuario no es admin
    if ($usuario['admin'] == 1) {
        throw new Exception('Los administradores no pueden inscribirse a torneos');
    }
    
    // Verificar que el torneo existe
    $stmt = $pdo->prepare("SELECT id, nombre FROM torneos WHERE id = ?");
    $stmt->execute([$torneo_id]);
    $torneo = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$torneo) {
        throw new Exception('Torneo no encontrado');
    }
    
    // Verificar que el usuario no está ya inscrito
    $stmt = $pdo->prepare("SELECT id FROM inscripciones_torneos WHERE usuario_id = ? AND torneo_id = ?");
    $stmt->execute([$usuario_id, $torneo_id]);
    $inscripcion_existente = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($inscripcion_existente) {
        throw new Exception('Ya estás inscrito en este torneo');
    }
    
    // Crear la inscripción
    $stmt = $pdo->prepare("
        INSERT INTO inscripciones_torneos (usuario_id, torneo_id, fecha_inscripcion, estado) 
        VALUES (?, ?, NOW(), 'activa')
    ");
    $stmt->execute([$usuario_id, $torneo_id]);
    
    // Respuesta exitosa
    echo json_encode([
        'status' => 'ok',
        'message' => 'Inscripción realizada exitosamente',
        'torneo' => $torneo,
        'inscripcion_id' => $pdo->lastInsertId()
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Error de base de datos: ' . $e->getMessage()
    ]);
}
?>
