# 說明
自動更新 [PVE](https://pve.proxmox.com/wiki/Main_Page) 上的 [Tailscale](https://tailscale.com/) 憑證

# Prerequisite
1. 安裝並設定完成 Tailscale
2. 安裝 [jq](https://jqlang.org/)


# 準備相關檔案

## 建立憑證更新 script

建立 script 檔案 `/usr/local/bin/update-tailscale-cert.sh`：
```bash
#!/bin/bash

# Set variables
DOMAIN=$(tailscale status --json | jq -r '.Self.DNSName' | sed 's/\.$//')

# Check if DOMAIN is empty
if [ -z "$DOMAIN" ]; then
    echo "Failed to get Tailscale domain name"
    exit 1
fi

# Create temporary directory
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

# Get new certificate from Tailscale with minimum validity of 30 days
if ! tailscale cert \
    --cert-file="${TEMP_DIR}/${DOMAIN}.crt" \
    --key-file="${TEMP_DIR}/${DOMAIN}.key" \
    --min-validity=720h \
    "$DOMAIN"; then
    echo "Failed to obtain certificate"
    exit 1
fi

# Check if certificate files exist
if [ ! -f "${TEMP_DIR}/${DOMAIN}.crt" ] || [ ! -f "${TEMP_DIR}/${DOMAIN}.key" ]; then
    echo "Certificate files were not generated"
    exit 1
fi

# Update PVE certificate
if ! pvenode cert set "${TEMP_DIR}/${DOMAIN}.crt" "${TEMP_DIR}/${DOMAIN}.key" --force --restart; then
    echo "Failed to update PVE certificate"
    exit 1
fi

echo "Certificate update completed"
```

## 設定 script 權限

```bash
chmod +x /usr/local/bin/update-tailscale-cert.sh
```

## 建立 systemd service

建立檔案 `/etc/systemd/system/update-tailscale-cert.service`：
```ini
[Unit]
Description=Update Proxmox SSL certificate from Tailscale
After=network.target tailscaled.service

[Service]
Type=oneshot
ExecStart=/usr/local/bin/update-tailscale-cert.sh

[Install]
WantedBy=multi-user.target
```

## 建立 systemd timer

建立檔案 `/etc/systemd/system/update-tailscale-cert.timer`：
```ini
[Unit]
Description=Update Proxmox SSL certificate daily

[Timer]
OnCalendar=daily
RandomizedDelaySec=3600
Persistent=true

[Install]
WantedBy=timers.target
```

# 啟用服務

## 啟用 systemd service 和 timer

```bash
# systemd configuration reload
systemctl daemon-reload

# enable & start timer
systemctl enable update-tailscale-cert.timer
systemctl start update-tailscale-cert.timer
```

# 確認設定

## 檢查 timer 狀態：

```bash
systemctl status update-tailscale-cert.timer
```

## 檢查下次執行時間：

```bash
systemctl list-timers update-tailscale-cert.timer
```

# 手動測試

## 立即測試 script 是否正常運作

```bash
systemctl start update-tailscale-cert.service
```

## 查看執行記錄

```bash
journalctl -u update-tailscale-cert.service -f
```

# 結語

## 功能說明
* 每天自動檢查並更新憑證
* 確保憑證至少有 30 天的有效期
* 自動使用正確的 Tailscale machine name
* 安全地處理憑證檔案
* 在更新後自動重啟相關服務

## 注意事項
1. 確保系統已安裝 [jq](https://jqlang.org/) 工具（用於解析 JSON）
2. 確保 Tailscale 正常運行且已連接
3. 確保有足夠的權限執行這些操作（需要 root 權限）