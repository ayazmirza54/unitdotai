# Most Widely Used UNIX Commands

A concise reference of commonly used UNIX commands and their most frequently used flags.

---

## 1. `ls` — List Directory Contents

* **Description**: Displays files and directories in the current or specified directory.
* **Common Flags**:

  * `-l` : Long listing format (permissions, owner, size, date)
  * `-a` : Include hidden files (`.` and `..`)
  * `-h` : Human-readable sizes (e.g., `1K`, `234M`)
  * `-R` : Recursive listing of subdirectories

```bash
ls -lahR /var/log
```

---

## 2. `cd` — Change Directory

* **Description**: Change the shell working directory.
* **Common Flags**: *None* (options are shell-specific, e.g., `-P` vs. `-L` for physical vs. logical in some shells)
* **Usage Examples**:

  ```bash
  cd /etc            # Go to /etc directory
  cd ..              # Move up one level
  cd                 # Go to home directory
  ```

---

## 3. `grep` — Pattern Search

* **Description**: Search for patterns within files.
* **Common Flags**:

  * `-i` : Case-insensitive search
  * `-r` or `-R` : Recursive search in directories
  * `-n` : Show line numbers
  * `-v` : Invert match (show non-matching lines)

```bash
grep -rin "error" /var/log
```

---

## 4. `find` — Search for Files

* **Description**: Search for files and directories based on conditions.
* **Common Flags/Options**:

  * `.` : Starting directory
  * `-name "pattern"` : Filename glob
  * `-type [f|d]` : File (`f`) or directory (`d`)
  * `-mtime +N` : Modified more than N days ago
  * `-exec ... {} \;` : Execute command on each match

```bash
find . -type f -name "*.log" -mtime +7 -exec rm {} \;
```

---

## 5. `cp` — Copy Files and Directories

* **Description**: Copy files or directories.
* **Common Flags**:

  * `-r` or `-R` : Copy directories recursively
  * `-p` : Preserve file attributes (mode, ownership, timestamps)
  * `-i` : Prompt before overwrite
  * `-u` : Copy only when source is newer

```bash
cp -rpu ~/projects /backup/
```

---

## 6. `mv` — Move or Rename Files and Directories

* **Description**: Move or rename files and directories.
* **Common Flags**:

  * `-i` : Prompt before overwrite
  * `-u` : Move only when source is newer

```bash
mv -i oldname.txt newname.txt
```

---

## 7. `rm` — Remove Files or Directories

* **Description**: Delete files or directories.
* **Common Flags**:

  * `-r` : Recursive deletion
  * `-f` : Force deletion without prompt
  * `-i` : Prompt before every removal

```bash
rm -rf /tmp/old_build/
```

---

## 8. `mkdir` — Make Directories

* **Description**: Create new directories.
* **Common Flags**:

  * `-p` : Create parent directories as needed

```bash
mkdir -p /var/www/myapp/{logs,tmp}
```

---

## 9. `chmod` — Change File Modes or Permissions

* **Description**: Modify access permissions.
* **Common Flags**:

  * Symbolic: `u+rwx`, `g-w`, `o=rx`
  * Numeric: `755`, `644`

```bash
chmod 644 ~/.ssh/authorized_keys
chmod u+rw,go-rwx secret.txt
```

---

## 10. `chown` — Change File Owner and Group

* **Description**: Change file owner and/or group.
* **Common Flags**:

  * `-R` : Recursive
  * `user:group` : Specify new owner and group

```bash
chown -R www-data:www-data /var/www/myapp
```

---

## 11. `ps` — Report Process Status

* **Description**: Display current processes.
* **Common Flags**:

  * `-e` : All processes
  * `-f` : Full-format listing
  * `-u username` : Processes of a specific user

```bash
ps -ef | grep nginx
```

---

## 12. `top` — Display Processes in Real Time

* **Description**: Monitor system processes and resource usage.
* **Common Flags**:

  * `-d seconds` : Delay between updates
  * `-u user` : Show only processes of a user

```bash
top -u root -d 5
```

---

## 13. `kill` — Send Signals to Processes

* **Description**: Send signals to terminate or control processes.
* **Common Flags**:

  * `-9` : SIGKILL (force kill)
  * `-15` : SIGTERM (default, graceful)

```bash
kill -15 1234
kill -9 $(pidof my_app)
```

---

## 14. `ssh` — Secure Shell

* **Description**: Connect to remote machines securely.
* **Common Flags**:

  * `-p port` : Specify non-default port
  * `-i keyfile` : Use a specific private key
  * `-C` : Enable compression

```bash
ssh -i ~/.ssh/id_rsa -p 2222 user@remote.host
```

---

## 15. `tar` — Archive Files

* **Description**: Create or extract archive files.
* **Common Flags**:

  * `-c` : Create archive
  * `-x` : Extract archive
  * `-v` : Verbose output
  * `-f` : Specify filename
  * `-z` : gzip compression
  * `-j` : bzip2 compression

```bash
tar czvf backup.tar.gz /etc
tar xjvf archive.tar.bz2
```

---

## 16. `curl` — Transfer Data from or to Server

* **Description**: Fetch or send data via URL.
* **Common Flags**:

  * `-O` : Save to file with remote name
  * `-o file` : Save output to `file`
  * `-I` : Fetch headers only
  * `-L` : Follow redirects
  * `-u user:pass` : HTTP authentication

```bash
curl -L -o latest.tar.gz https://example.com/app.tar.gz
curl -I https://api.example.com/status
```

---

## 17. `wget` — Non-interactive Network Downloader

* **Description**: Download files from the web.
* **Common Flags**:

  * `-O file` : Save output as `file`
  * `-c` : Continue incomplete download
  * `-r` : Recursive download
  * `--no-parent` : Don’t ascend to parent directory

```bash
wget -c http://example.com/large.iso
```

---

## 18. `cat` — Concatenate and Print Files

* **Description**: Display file contents.
* **Common Flags**:

  * `-n` : Number all output lines
  * `-b` : Number non-blank lines

```bash
cat -n README.md
```

---

## 19. `less` — View File Contents Paginated

* **Description**: View file contents one page at a time.
* **Common Flags**:

  * `-N` : Show line numbers
  * `-S` : Chop long lines (no wrap)

```bash
less -N /var/log/syslog
```

---

## 20. `head` & `tail` — View Beginning or End of Files

* **Common Flags**:

  * `-n N` : Show first/last N lines
  * `-f` (for `tail`) : Follow file as it grows

```bash
head -n 20 access.log
tail -n 50 -f /var/log/nginx/error.log
```

---

## 21. `echo` — Display a Line of Text

* **Description**: Print text to the terminal.
* **Common Flags**:

  * `-n` : Do not output trailing newline
  * `-e` : Enable interpretation of backslash escapes

```bash
echo -e "User:\t$(whoami)"
```

---

## 22. `awk` — Pattern Scanning and Processing

* **Description**: Process and analyze text files, especially columnar data.
* **Common Flags**:

  * `-F` : Field separator
  * `'{ print $1, $3 }'` : Inline script to select fields

```bash
awk -F: '$3 > 1000 { print $1 }' /etc/passwd
```

---

## 23. `sed` — Stream Editor

* **Description**: Perform basic text transformations on an input stream.
* **Common Flags**:

  * `-e script` : Add editing commands
  * `-i` : Edit files in place

```bash
sed -i 's/oldtext/newtext/g' file.txt
```

---

## 24. `man` — Display Manual Pages

* **Description**: View system reference manuals.
* **Common Flags**:

  * `-k keyword` : Search manual page names and descriptions
  * `section` : Specify section number

```bash
man -k socket
man 5 crontab
```

---

*End of Reference*
