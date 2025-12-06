package main

import (
    "bytes"
    "encoding/json"
    "log"
    "net/http"
    "time"
)

func SendToAPI(apiURL string, msg WeatherMessage) error {
    jsonData, _ := json.Marshal(msg)

    client := &http.Client{Timeout: 5 * time.Second}

    req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(jsonData))
    if err != nil {
        return err
    }

    req.Header.Set("Content-Type", "application/json")

    resp, err := client.Do(req)
    if err != nil {
        return err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
        log.Printf("⚠️ API retornou %d", resp.StatusCode)
    }

    return nil
}
