# 在 Synology NAS 上安裝 Tailscale 憑證方法

可以使用一個未記載於文件上的指令
```bash
tailscale configure synology-cert
```

## 步驟
1. 將 Synology 上的 Tailscale 更新到至少 `1.64.0` 版本
2. 進入「**控制台**」 -> 「 **測試任務排程表**」
3. 新增「**排程任務**」 -> 「**使用者定義指令碼**」
4. 設定排程
   * **一般**
     * **任務名稱** 填入 `Renew Tailscale Certificate`
     * **使用者帳號** 選擇 `root` 帳號執行
   * **排程**
     * 在以下時間執行，**重複** `每週`，選其中一天即可，如 `週六`(每月更新一次)
   * **任務設定**
     * 在**使用者定義指令碼**欄位中填入 `tailscale configure synology-cert`。
5. 按下「**確定**」，跳出以 `root` 身份執行 script 警告再點選「**確定**」，輸入使用者密碼同意確認。
6. 在「**任務排程表**」選擇剛剛建立的任務 `Renew Tailscale Certificate`，點選上方「**執行**」就可以立即執行
7. 如 Tailscale 憑證安裝成功，進入「控制台」 -> 「安全性」 -> 「憑證」會看到出現 `<machine_name>.<ts_net_name>.ts.net` 憑證。 



## 參考來源
* [Tailscale HTTPS certificate on Synology NAS](https://sim642.eu/blog/2024/08/11/tailscale-https-certificate-on-synology-nas/)