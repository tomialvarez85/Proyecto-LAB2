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
    
    // Validar campo obligatorio
    if (!isset($input['usuario_id'])) {
        throw new Exception('Campo usuario_id es obligatorio');
    }
    
    $usuario_id = $input['usuario_id'];
    
    // Obtener inscripciones del usuario
    $stmt = $pdo->prepare("
        SELECT 
            it.id as inscripcion_id,
            it.torneo_id,
            it.fecha_inscripcion,
            it.estado,
            t.nombre as torneo_nombre,
            t.descripcion as torneo_descripcion,
            t.fecha as torneo_fecha
        FROM inscripciones_torneos it
        JOIN torneos t ON it.torneo_id = t.id
        WHERE it.usuario_id = ?
        ORDER BY it.fecha_inscripcion DESC
    ");
    $stmt->execute([$usuario_id]);
    $inscripciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Respuesta exitosa
    echo json_encode([
        'status' => 'ok',
        'message' => 'Inscripciones obtenidas exitosamente',
        'inscripciones' => $inscripciones,
        'total' => count($inscripciones)
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
