# Keeping Your Node.js Script Running Continuously

When running a Node.js script with a cron job, you might want to ensure it continues running even after closing the terminal. Here’s how you can achieve that using process managers or system services.

## Using `pm2` for Continuous Running

`pm2` is a popular process manager for Node.js that allows you to manage and keep your application running in the background.

### 1. Install `pm2` Globally

```bash
npm install -g pm2
```

### 2. Start Your Script with `pm2`

```bash
pm2 start your-script.js
```

Replace `your-script.js` with the path to your Node.js script.

### 3. Save the `pm2` Process List

```bash
pm2 save
```

### 4. Configure `pm2` to Restart on System Boot

```bash
pm2 startup
```

### 5. Monitor Your Process

```bash
pm2 list
pm2 logs
```

## Using `systemd` for System Service

For Linux systems, you can use `systemd` to manage your Node.js script as a system service.

### 1. Create a Service File

Create a file named `/etc/systemd/system/cron-job.service` with the following content:

```ini
[Unit]
Description=My Cron Job Service

[Service]
ExecStart=/usr/bin/node /path/to/your-script.js
Restart=always
User=your-username
Group=your-group

[Install]
WantedBy=multi-user.target
```

Replace `/path/to/your-script.js` with the path to your Node.js script, and `your-username` and `your-group` with the appropriate user and group.

### 2. Reload `systemd` and Start the Service

```bash
sudo systemctl daemon-reload
sudo systemctl start cron-job
sudo systemctl enable cron-job
```

### 3. Check the Status of Your Service

```bash
sudo systemctl status cron-job
```


# Managing and Stopping Processes with `pm2`

## 1. Stop a Specific Process

To stop a specific process managed by `pm2`, use the `pm2 stop` command followed by the process name or ID.

### By Process Name
```bash
pm2 stop your-script-name
```

### By Process ID
```bash
pm2 stop <process-id>
```

You can find the process ID by running `pm2 list`.

## 2. Stop All Processes

To stop all processes managed by `pm2`, use:

```bash
pm2 stop all
```

## 3. Delete a Specific Process

Stopping a process does not remove it from the `pm2` process list. To completely delete it, use:

### By Process Name
```bash
pm2 delete your-script-name
```

### By Process ID
```bash
pm2 delete <process-id>
```

## 4. Delete All Processes

To delete all processes from the `pm2` list, use:

```bash
pm2 delete all
```

## 5. Restart a Process

If you want to restart a process instead of stopping it, use:

### By Process Name
```bash
pm2 restart your-script-name
```

### By Process ID
```bash
pm2 restart <process-id>
```

## 6. Save and Reload Process List

After stopping or deleting processes, you might want to save the updated process list or reload the saved list:

### Save the Current Process List
```bash
pm2 save
```

### Reload the Saved Process List
```bash
pm2 resurrect
```

## 7. Monitor Process Logs

To view logs for your processes, use:

```bash
pm2 logs
```
