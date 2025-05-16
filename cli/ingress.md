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
# RedHat Unix Commands Comprehensive Reference

## Linux History

* Originated from Unix (1969)
* Linux kernel created by Linus Torvalds in 1991
* Distributions: Ubuntu, Red Hat, Fedora, etc.

## Why Red Hat?

* Used by 90% of Fortune Global 500
* Secure, scalable, professionally supported

## Types of Linux Installation

* Kickstart (Automated)
* Graphical
* Text-based

## Linux Components

* **Kernel:** Core OS component
* **Shell:** Interface between user and kernel (bash is most common)
* **Terminal:** Interface to type and view commands
* **Shell Types:** sh, ksh, csh, bash

---

## General Commands Structure

```
command [options] [arguments]
```

| Command                | Explanation                               |
| ---------------------- | ----------------------------------------- |
| uname                  | Displays system name                      |
| uname -n               | Hostname of the system                    |
| uname -a               | All available system information          |
| cal                    | Calendar for current month                |
| cal 5 2004             | Calendar for May 2004                     |
| date                   | Displays current date and time            |
| Ctrl + c               | Interrupts a running command              |
| Ctrl + d               | Ends input or logs out                    |
| man -k keyword         | Search manual pages by keyword            |
| man -s keyword         | Manual section for keyword                |
| whatis command         | One-line description of a command         |
| command --help         | Show help for command                     |
| pwd                    | Show current directory                    |
| cd /path               | Change to specified directory             |
| cd ..                  | Go up one directory                       |
| cd \~                  | Go to home directory                      |
| cd -                   | Go to previous directory                  |
| ls                     | List directory contents                   |
| ls -a                  | Show all files including hidden ones      |
| ls -l                  | Long listing with permissions, size, etc. |
| ls -F                  | Adds symbols to indicate file types       |
| ls -ld dir             | Show details of the directory itself      |
| ls -R                  | Recursively list subdirectories           |
| cat filename           | Show file content                         |
| more filename          | Scroll through file content               |
| head -n filename       | Show first n lines of file                |
| tail \[-n +n] filename | Show last n lines of file                 |
| touch filename         | Create an empty file                      |
| mkdir dir              | Create a new directory                    |
| mkdir -p dir/dir2      | Create nested directories                 |
| rm filename            | Delete file                               |
| rm -i filename         | Ask before deletion                       |
| rm -r dirname          | Delete directory and contents             |
| rmdir dirname          | Delete an empty directory                 |
| cp source target       | Copy file                                 |
| cp -i                  | Ask before overwriting file               |
| cp -r                  | Copy directory recursively                |
| mv source target       | Move or rename file                       |

---

## User & Group Administration

* User files: `/etc/passwd`, `/etc/shadow`, `/etc/group`, `/etc/gshadow`
* Create user: `useradd`, `passwd`, `newusers`
* Modify user: `usermod`, `chage`
* Delete user: `userdel`
* Group management: `groupadd`, `groupmod`, `groupdel`, `gpasswd`, `newgrp`, `groups`
* File/Dir ownership: `chown`, permissions: `chmod`, defaults: `umask`
* Switch users: `su`, `whoami`, `id`, `who`, `w`, `finger`, `sudo`
* Shutdown, reboot, virtual consoles (`Ctrl+Alt+F1` to `F6`)

| Command                        | Explanation                          |
| ------------------------------ | ------------------------------------ |
| useradd username               | Add a new user                       |
| passwd username                | Set the user's password              |
| useradd -D                     | Show default useradd settings        |
| newusers filename              | Create multiple users from file      |
| usermod -l newname oldname     | Change a username                    |
| usermod -L username            | Lock the user's password             |
| usermod -U username            | Unlock the user's password           |
| userdel \[-r] username         | Delete user (optionally home dir)    |
| chage \[options] username      | Manage password aging policies       |
| groupadd groupname             | Create a new group                   |
| groupmod \[options] groupname  | Modify an existing group             |
| groupdel groupname             | Delete a group                       |
| find / -nogroup                | List files with no valid group       |
| gpasswd                        | Manage group members/admins          |
| newgrp group                   | Switch to another group              |
| groups                         | List groups you belong to            |
| su \[-] \[username]            | Switch user                          |
| su \[-] \[username] -c command | Execute command as another user      |
| whoami                         | Show current effective user          |
| id                             | Show UID, GID, groups                |
| id username                    | Show UID, GID, groups of user        |
| who                            | Show who is logged in                |
| w                              | Show system usage and active users   |
| finger                         | Show user info                       |
| sudo                           | Execute a command as another user    |
| visudo                         | Edit sudoers file safely             |
| chown user file                | Change file ownership to user        |
| chown user\:group file         | Change file owner and group          |
| chmod \[modes] file            | Change file permissions              |
| chmod u+x file                 | Add execute permission to user       |
| chmod a=rw file                | Set read/write for all               |
| chmod 755 file                 | Set permissions in octal             |
| umask                          | Show current default permission mask |
| umask 002                      | Set default file permission mask     |
| Ctrl+Alt+F1 to F6              | Switch to virtual consoles           |
| shutdown -k now                | Send shutdown warning only           |
| shutdown -h now                | Shut down and halt system            |
| poweroff                       | Power off system                     |
| init 0                         | Shut down the system                 |

---

## Vi Text Editor (vim)

* Default text editor in Linux/Unix
* Modes: command, insert, last line (save/search/commands)
* Global init: `/etc/profile`, `/etc/bash.bashrc`
* User init: `~/.profile`, `~/.bash_profile`, `~/.bash_login`, `~/.bashrc`
* Env vars: `$HOME`, `$PATH`, `$PWD`, `$SHELL`, `$USER`, `$HOSTNAME`
* Aliases & history: create/list/remove aliases, repeat previous commands

| Key/Command      | Action                         |
| ---------------- | ------------------------------ |
| vi filename      | Open file in vi                |
| vi -r filename   | Recover unsaved file           |
| view filename    | Open in read-only mode         |
| i                | Insert before cursor           |
| a                | Append after cursor            |
| o                | Open new line below            |
| O                | Open new line above            |
| A                | Append at end of line          |
| I                | Insert at beginning of line    |
| h, <-, Backspace | Move left                      |
| l, ->, Space     | Move right                     |
| j, Down Arrow    | Move down                      |
| k, Up Arrow      | Move up                        |
| w                | Next word                      |
| b                | Previous word                  |
| e                | End of word                    |
| 0                | Beginning of line              |
| G                | End of file                    |
| nG / \:n         | Go to line number n            |
| Ctrl+F/B         | Scroll forward/back            |
| Ctrl+L           | Refresh screen                 |
| s                | Replace character              |
| x                | Delete character               |
| dw               | Delete word                    |
| dd               | Delete line                    |
| D                | Delete to end of line          |
| n,nd             | Delete lines n through n       |
| /text            | Search forward                 |
| ?text            | Search backward                |
| n, N             | Next/previous match            |
| :%s/old/new/g    | Global replace                 |
| yy               | Yank line                      |
| p, P             | Paste after/before line        |
| n,n co n         | Copy lines to line n           |
| n,n m n          | Move lines to line n           |
| :w               | Save                           |
| :w new\_file     | Save as new file               |
| :q!              | Quit without saving            |
| :wq, \:x, ZZ     | Save and exit                  |
| :set nu / nonu   | Show/hide line numbers         |
| :set ic / noic   | Case insensitivity/sensitivity |
| :set showmode    | Show mode info                 |

---

## Shell, Bash, Alias & History

**Environment Variables:**

* `$HOME`, `$PATH`, `$PWD`, `$SHELL`, `$USER`, `$HOSTNAME`
* `echo $VAR`: Show value
* `set`: Show all variables

**Alias Commands:**

* `alias ll='ls -l'`: Create alias
* `alias`: List all aliases
* `unalias name`: Remove alias
* `\command`: Run command without alias

**Command History:**

* `!!`: Repeat last command
* `!string`: Repeat last starting with "string"
* `!n`: Run command by number
* `!-n`: Run n commands back
* `^old^new`: Replace text in previous command

---

## Processes, Redirection, Pipelines, Word Count, and String Processing

### Processes, Priorities, Signals

* Process = running program, has PID
* Daemon: background process
* Parent/child process
* Priority (niceness): -20 (highest) to +19 (lowest)
* Users can only lower their process priority; root can raise

| Command                | Explanation                              |
| ---------------------- | ---------------------------------------- |
| nice \[-n adjustment]  | Start a process with a specific niceness |
| renice priority -p PID | Change priority of a running process     |
| ps \[options]          | Show process status                      |
| ps -e                  | List all system processes                |
| ps -f                  | Full details                             |
| ps -u UID              | Processes of a specific user             |
| top                    | Live view of running processes           |
| pgrep pattern          | Find processes matching a pattern        |
| pgrep -l pattern       | List PID and process name                |
| kill PID               | Send SIGTERM to a process                |
| kill -SIGNAL PID       | Send specific signal                     |
| pkill process\_name    | Kill processes by name                   |
| pkill -9 process\_name | Force kill process                       |

### Job Control

| Command                 | Explanation               |
| ----------------------- | ------------------------- |
| sleep 500 &             | Run process in background |
| jobs                    | List background jobs      |
| fg %job\_number         | Bring job to foreground   |
| bg %job\_number         | Resume job in background  |
| kill -STOP %job\_number | Pause background job      |
| kill %job\_number       | Kill background job       |

### Redirection & Pipelines

| Command                   | Explanation                         |                                  |
| ------------------------- | ----------------------------------- | -------------------------------- |
| command > file            | Redirect output to file (overwrite) |                                  |
| command >> file           | Redirect output to file (append)    |                                  |
| command < file            | Use file as input                   |                                  |
| 2> file                   | Redirect standard error to file     |                                  |
| command 2> errs > results | Error to errs, output to results    |                                  |
| command1                  | command2                            | Output of one command to another |
| ls -lR /                  | more                                | Example: piped output to pager   |
| ls -lR /                  | tee file                            | Output to both file and screen   |

### Word Count & String/Text Processing

| Command                       | Explanation                                    |                      |
| ----------------------------- | ---------------------------------------------- | -------------------- |
| wc \[options] filename        | Word count utility                             |                      |
| wc -c filename                | Character count                                |                      |
| wc -l filename                | Line count                                     |                      |
| wc -w filename                | Word count                                     |                      |
| diff file1 file2              | Compare two files                              |                      |
| grep \[options] pattern files | Search for patterns                            |                      |
| grep -i pattern               | Case insensitive search                        |                      |
| grep -l pattern files         | List matching files                            |                      |
| grep -n pattern files         | Matching lines with line number                |                      |
| grep -v pattern files         | Invert match (show non-matching lines)         |                      |
| grep -c pattern files         | Count matches                                  |                      |
| grep -w pattern files         | Match whole word only                          |                      |
| tr \[options] string1 string2 | Translate characters                           |                      |
| echo "Hello"                  | tr 'A-Z' 'a-z'                                 | Convert to lowercase |
| cut -f3 -d: /etc/passwd       | Cut field 3 from /etc/passwd (colon-separated) |                      |
| cut -c1-5 filename            | Cut characters 1 to 5                          |                      |
| sort \[options] file          | Sort file                                      |                      |
| sort -t: -k1 /etc/passwd      | Sort by first field (:)                        |                      |
| sort -t: -k3 /etc/passwd      | Sort by third field                            |                      |
| sort -t: -n -k3 -o out in     | Numeric sort by 3rd field (output to out)      |                      |

---

## Filesystem, Package Management, Search, Archiving

### Filesystem & Inodes

| Command             | Explanation                             |
| ------------------- | --------------------------------------- |
| ls -i fname         | Show inode number of a file             |
| ls -id /            | Show inode number of a directory        |
| cp f1 f2            | Creates a new inode for the copied file |
| mv f1 f2            | Keeps same inode if in same filesystem  |
| ln -s file linkname | Create symbolic (soft) link             |
| ln file linkname    | Create hard link (same inode)           |

### Disk Usage

| Command       | Explanation                                        |
| ------------- | -------------------------------------------------- |
| df -h         | Free space on mounted filesystems (human readable) |
| du -sh \[dir] | Space used by a directory                          |

### RPM Package Management

| Command          | Explanation                             |                           |
| ---------------- | --------------------------------------- | ------------------------- |
| rpm -i file.rpm  | Install RPM package                     |                           |
| rpm -e package   | Remove package                          |                           |
| rpm -U file.rpm  | Upgrade (remove old, install new)       |                           |
| rpm -F file.rpm  | Freshen (update if installed)           |                           |
| rpm -qa          | grep x                                  | Search installed packages |
| rpm -qa --last   | List packages by install time           |                           |
| rpm --import key | Import GPG key for package verification |                           |

### YUM Package Manager

| Command                         | Explanation                       |
| ------------------------------- | --------------------------------- |
| yum search keyword              | Search for packages               |
| yum list package                | Show versions available/installed |
| yum list installed              | List installed packages           |
| yum list available              | List repo packages                |
| yum grouplist "string"          | Show groups matching string       |
| yum install package             | Install package and dependencies  |
| yum localinstall /path/file.rpm | Install local RPM file            |
| yum remove package              | Uninstall a package               |
| yum upgrade package             | Upgrade and remove old version    |
| yum update package              | Update but keep old               |
| yum provides file               | Find which package owns a file    |
| yum repolist all                | Show all repos                    |
| yum clean all                   | Clear YUM cache                   |

### File Search

| Command                    | Explanation                                 |
| -------------------------- | ------------------------------------------- |
| locate filename            | Fast search using database (needs updatedb) |
| updatedb                   | Update locate database                      |
| find path -name "filename" | Find files by name                          |
| find path -size +10        | Files larger than 10 blocks                 |
| find path -atime -7        | Accessed within last 7 days                 |
| find path -mtime +5        | Modified more than 5 days ago               |
| find path -user user       | Owned by user                               |
| find path -type f          | Find regular files                          |
| find path -perm 644        | Find files with permissions 644             |

### Archiving & Compression

**tar – Archive tool**

* `tar cvf archive.tar files` – Create archive
* `tar tf archive.tar` – View contents
* `tar xvf archive.tar` – Extract files

**compress, uncompress, zcat**

* `compress -v file` – Compress file → .Z
* `uncompress -v file.Z` – Decompress .Z file
* `zcat file.Z` – View compressed file content
* `gzip file` – Compress → .gz
* `gunzip file.gz` – Decompress .gz file
* `gzcat file.gz` – View .gz file content
* `bzip2 file` – Compress → .bz2
* `bunzip2 file.bz2` – Decompress .bz2 file
* `bzcat file.bz2` – View .bz2 file content

---

# Summary Table of Major Topics

| TopicDescription           |                                          |
| -------------------------- | ---------------------------------------- |
| Linux History              | Origins, kernel, distributions           |
| Why Red Hat?               | Enterprise use, security, support        |
| Installation Types         | Kickstart, graphical, text-based         |
| System Components          | Kernel, shell, terminal                  |
| General Commands           | Basic navigation and file operations     |
| User/Group Management      | Adding, modifying, removing users/groups |
| Permissions & Ownership    | chown, chmod, umask                      |
| Vi Editor                  | Modes, navigation, editing, saving       |
| Shell/Bash Environment     | Env variables, aliases, history          |
| Process Management         | ps, top, nice, kill, job control         |
| Redirection/Pipelines      | Output/input/error, chaining commands    |
| Text Processing            | wc, grep, cut, sort, diff                |
| Filesystem/Inodes          | Links, inodes, disk usage                |
| RPM/YUM Package Management | rpm/yum operations, searching, cleaning  |
| File Search                | find, locate, updatedb                   |
| Archiving/Compression      | tar, gzip, bzip2, compress               |

---

# End of Document

