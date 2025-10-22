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
    if (!isset($input['fecha'])) {
        throw new Exception('Campo fecha es obligatorio');
    }
    
    $fecha = $input['fecha'];
    
    // Validar formato de fecha
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        throw new Exception('Formato de fecha inválido. Use YYYY-MM-DD');
    }
    
    // Lista de canchas disponibles
    $canchas = [
        ['id' => 1, 'nombre' => 'Cancha 1'],
        ['id' => 2, 'nombre' => 'Cancha 2'],
        ['id' => 3, 'nombre' => 'Cancha 3']
    ];
    
    // Lista de horarios disponibles
    $horarios = [
        '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
        '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
    ];
    
    // Obtener reservas existentes para la fecha
    $stmt = $pdo->prepare("
        SELECT cancha_id, hora, usuario_id, estado
        FROM reservas 
        WHERE fecha = ? AND estado != 'cancelada'
        ORDER BY cancha_id, hora
    ");
    $stmt->execute([$fecha]);
    $reservas_existentes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Crear estructura de disponibilidad
    $disponibilidad = [];
    
    foreach ($canchas as $cancha) {
        $horas = [];
        
        foreach ($horarios as $hora) {
            // Verificar si hay reserva para esta cancha y hora
            $ocupado = false;
            
            foreach ($reservas_existentes as $reserva) {
                if ($reserva['cancha_id'] == $cancha['id'] && $reserva['hora'] == $hora) {
                    $ocupado = true;
                    break;
                }
            }
            
            $horas[] = [
                'hora' => $hora,
                'disponible' => !$ocupado
            ];
        }
        
        $disponibilidad[] = [
            'cancha_id' => $cancha['id'],
            'nombre' => $cancha['nombre'],
            'horas' => $horas
        ];
    }
    
    // Respuesta exitosa
    echo json_encode([
        'status' => 'ok',
        'fecha' => $fecha,
        'disponibilidad' => $disponibilidad
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
