package main

type WeatherMessage struct {
    StationID   string                 `json:"stationId"`
    Timestamp   string                 `json:"timestamp"`
    Temperature float64                `json:"temperature"`
    Humidity    float64                `json:"humidity"`
    Pressure    float64                `json:"pressure"`
    Extra       map[string]interface{} `json:"extra,omitempty"`
    RetryCount  int                    `json:"retryCount,omitempty"` // para retry
}

type ApiResponse struct {
    Success bool   `json:"success"`
    Error   string `json:"error"`
}
