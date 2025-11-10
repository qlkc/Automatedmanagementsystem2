# Champion Fine Tooling Corporation - Implementation Guide

## System Overview

This is a **1280×720 px fixed-size LAN-based desktop application** for Champion Fine Tooling Corporation's Automated Management System. The UI is designed to be modern, minimalist, and Python/Tkinter-compatible.

## Brand Identity

### Colors
- **Primary Deep Green**: `#2C5E2E`
- **Yellow-Gold Gradient**: `#F5D000` → `#FFD74D`
- **Warm Brown (Archive)**: `#A25E2D`
- **Success Green**: `#2EA44F`
- **Error Red**: `#E02424`
- **Off-White Background**: `#F8F9FA`

### Typography
- **Font**: Inter (fallback: Roboto)
- **Module Titles**: Inter Bold, 18px, ALL-CAPS, letter-spacing: 1.2px
- **Section Labels**: Inter Medium, 13px
- **Body Text**: Inter Regular, 12px
- **Helper Text**: Inter Regular, 11px, color #6B7280

## Architecture & Data Flow

### Key Design Principles
1. **NO DELETION** - All records use ARCHIVE instead of DELETE
2. **Fixed Layout** - 1280×720px window (non-resizable)
3. **LAN-Based** - Multi-user access via local network
4. **Audit Trail** - All changes preserved through archiving

### Module Structure

```
┌─────────────────────────────────────────────────────┐
│ Header (64px)                                       │
│ Logo (48×48) | Title | Time | User | Logout        │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │ Main Content Area                       │
│ (260px)  │ (1020px × 656px)                        │
│          │                                          │
│ • Dash   │ Dynamic module content                  │
│ • Emp    │ with forms, tables, modals              │
│ • Reg    │                                          │
│ • Roles  │                                          │
│ • Inv    │                                          │
│ • Tag    │                                          │
│ • Borrow │                                          │
│ • Reports│                                          │
│ • Search │                                          │
│ • Profile│                                          │
│ • Help   │                                          │
│ • Maint  │                                          │
│ • Exit   │                                          │
└──────────┴──────────────────────────────────────────┘
```

## Tkinter Mapping Reference

### Component Equivalents

| React Component | Tkinter Equivalent | Notes |
|----------------|-------------------|-------|
| `<div>` wrapper | `tk.Frame` | Main container panels |
| Header | `tk.Frame` with Labels & Buttons | Fixed at top |
| Sidebar | `tk.Frame` with gradient | Use `tk.Canvas` for gradient |
| CustomButton | `ttk.Button` or `tk.Button` | Styled with `style.configure()` |
| CustomInput | `ttk.Entry` | Text input fields |
| CustomSelect | `ttk.Combobox` | Dropdown menus |
| CustomTable | `ttk.Treeview` | Multi-column table |
| CustomModal | `tk.Toplevel` | Modal dialog window |
| Toast | Small `tk.Toplevel` | Auto-destroy after 4s |
| StatusBadge | `tk.Label` with colored bg | Small colored indicators |

### Database Schema Mapping

#### Products Table
```python
CREATE TABLE products (
    pid TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    qty INTEGER NOT NULL,
    status TEXT DEFAULT 'Active'  -- Active, Inactive, Archived
)
```

#### Employees Table
```python
CREATE TABLE employees (
    emp_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    contact TEXT,
    status TEXT DEFAULT 'Active'
)
```

#### Tags Table
```python
CREATE TABLE tags (
    tag_id TEXT PRIMARY KEY,
    product_id TEXT,
    product_name TEXT,
    condition TEXT DEFAULT 'Good',  -- Good, Needs Repair
    status TEXT DEFAULT 'Active',
    last_borrower TEXT,
    FOREIGN KEY (product_id) REFERENCES products(pid)
)
```

#### Transactions Table
```python
CREATE TABLE transactions (
    trans_id TEXT PRIMARY KEY,
    tool_tag TEXT NOT NULL,
    tool_name TEXT,
    borrower TEXT NOT NULL,
    borrow_date TEXT NOT NULL,
    return_date TEXT,
    status TEXT DEFAULT 'Borrowed',  -- Borrowed, Returned
    FOREIGN KEY (tool_tag) REFERENCES tags(tag_id)
)
```

#### Roles Table
```python
CREATE TABLE roles (
    role_id TEXT PRIMARY KEY,
    role_name TEXT NOT NULL UNIQUE,
    description TEXT,
    status TEXT DEFAULT 'Active',
    assigned_users INTEGER DEFAULT 0
)
```

## Module Specifications

### 1. Login Module
**File**: `LoginModule.tsx`

**Tkinter Implementation**:
```python
class LoginWindow(tk.Toplevel):
    def __init__(self):
        # Center card 420×380px
        self.username_entry = ttk.Entry(width=30)
        self.password_entry = ttk.Entry(show="*", width=30)
        self.remember_var = tk.BooleanVar()
        self.remember_check = ttk.Checkbutton(variable=self.remember_var)
        self.login_btn = ttk.Button(text="Login", command=self.login)
```

**Validation**:
- Username and password required
- Error message: "Incorrect username or password"

---

### 2. Registration & Verification Module
**File**: `RegistrationModule.tsx`

**3-Step Process**:
1. **Step 1**: User info form (name, email, username, password, role)
2. **Step 2**: 6-digit verification code entry
3. **Step 3**: Success confirmation

**Tkinter Implementation**:
```python
class RegistrationWindow(tk.Toplevel):
    def __init__(self):
        self.step = 1
        self.notebook = ttk.Notebook()  # Or manual frame switching
        
    def step1_form(self):
        # Full name, email, username, password inputs
        self.role_combo = ttk.Combobox(values=['Admin', 'Staff'])
        
    def step2_verification(self):
        # 6-digit code entry
        self.code_entry = ttk.Entry(width=10, validate='key')
        
    def step3_success(self):
        # Success message with checkmark
        tk.Label(text="Account Created Successfully!")
```

---

### 3. Role Management Module
**File**: `RoleManagementModule.tsx`

**Features**:
- Add/Update roles
- Archive roles (NOT delete)
- Assign users to roles via modal with checkboxes
- Table columns: Role ID, Role Name, Description, Status, Assigned Users

**Tkinter Implementation**:
```python
class RoleManagementFrame(ttk.Frame):
    def __init__(self):
        # Left form panel
        self.role_name_entry = ttk.Entry()
        self.desc_entry = ttk.Entry()
        self.status_combo = ttk.Combobox(values=['Active', 'Inactive'])
        
        # Right table
        self.tree = ttk.Treeview(columns=('id', 'name', 'desc', 'status', 'users'))
        self.tree.heading('id', text='Role ID')
        
        # Buttons
        self.add_btn = ttk.Button(text="Add Role", style='Green.TButton')
        self.archive_btn = ttk.Button(text="Archive", style='Brown.TButton')
```

---

### 4. Products / Inventory Module
**File**: `InventoryModule.tsx`

**Layout**: 
- Left form (480px): Category, Name, Price, Qty, Status
- Right table: PID, Category, Name, Price, Qty, Status

**Actions**: Save, Update, Archive, Clear

**Tkinter Implementation**:
```python
class InventoryFrame(ttk.Frame):
    def __init__(self):
        # Left form
        self.category_combo = ttk.Combobox(values=['Tools', 'Measuring', 'Safety'])
        self.name_entry = ttk.Entry()
        self.price_entry = ttk.Entry(validate='key')  # Numeric only
        self.qty_spinbox = ttk.Spinbox(from_=0, to=9999)
        
        # Right table with search
        self.filter_combo = ttk.Combobox(values=['By: Name', 'By: Category'])
        self.search_entry = ttk.Entry()
        self.tree = ttk.Treeview(columns=('pid', 'cat', 'name', 'price', 'qty', 'status'))
        
        # Double-click to edit
        self.tree.bind('<Double-1>', self.on_row_double_click)
```

---

### 5. Tagging Module
**File**: `TaggingModule.tsx`

**Purpose**: Assign QR/Tag IDs to tools

**Fields**:
- Product ID (lookup/dropdown)
- Tag ID (manual or scan simulation)
- Condition (Good / Needs Repair)
- Status (Active/Inactive)

**Special Features**:
- QR code preview modal
- Print QR code button
- Visual differentiation for assigned/unassigned tags

**Tkinter Implementation**:
```python
class TaggingFrame(ttk.Frame):
    def __init__(self):
        self.product_combo = ttk.Combobox()
        self.tag_entry = ttk.Entry()
        self.scan_btn = ttk.Button(text="Scan", command=self.simulate_scan)
        self.qr_preview_btn = ttk.Button(text="Preview QR", command=self.show_qr)
        
        # Generate QR using qrcode library
        import qrcode
        
    def show_qr(self):
        qr_window = tk.Toplevel()
        img = qrcode.make(self.tag_entry.get())
        # Display image in Toplevel
```

**Table Columns**: Tag ID, Product Name, Status, Condition, Last Borrower

---

### 6. Borrowing & Return Module
**File**: `BorrowingModule.tsx`

**Layout**: Dual panel
- Left: Borrower Info (Emp ID, Name, Dept)
- Right: Tool Info (Tag ID, Tool Name, Condition, Return Date)

**Tkinter Implementation**:
```python
class BorrowingFrame(ttk.Frame):
    def __init__(self):
        # Left panel
        self.emp_id_entry = ttk.Entry()
        self.emp_id_entry.bind('<FocusOut>', self.auto_fill_employee)
        
        # Right panel
        self.tag_entry = ttk.Entry()
        self.scan_btn = ttk.Button(text="Scan Tag")
        
        # Use tkcalendar for date picker
        from tkcalendar import DateEntry
        self.return_date = DateEntry()
        
        # Transaction table
        self.trans_tree = ttk.Treeview(columns=('tid', 'tag', 'name', 'borrower', 'bdate', 'rdate', 'status'))
```

**Modals**: Confirm borrow/return with summary

---

### 7. Reports Module
**File**: `ReportsModule.tsx`

**Features**:
- Filter panel: Date range, category, status
- Summary KPIs
- Generate PDF / Export CSV

**Tkinter Implementation**:
```python
class ReportsFrame(ttk.Frame):
    def __init__(self):
        from tkcalendar import DateEntry
        self.start_date = DateEntry()
        self.end_date = DateEntry()
        
        # Export buttons
        self.pdf_btn = ttk.Button(text="Generate PDF", command=self.export_pdf)
        self.csv_btn = ttk.Button(text="Export CSV", command=self.export_csv)
        
    def export_pdf(self):
        from reportlab.lib.pagesizes import A4, landscape
        # Generate PDF report
        
    def export_csv(self):
        import pandas as pd
        df = pd.DataFrame(self.report_data)
        df.to_csv('report.csv', index=False)
```

---

### 8. Search Module
**File**: `SearchModule.tsx`

**Global search across**: Tools, Employees, Transactions
**Filters**: Type, Status, Date range
**Results**: Table with result-type badge

**Tkinter Implementation**:
```python
class SearchFrame(ttk.Frame):
    def __init__(self):
        self.search_entry = ttk.Entry(width=50)
        self.type_combo = ttk.Combobox(values=['All', 'Tool', 'Employee', 'Transaction'])
        self.search_btn = ttk.Button(text="Search", command=self.perform_search)
        
    def perform_search(self):
        query = self.search_entry.get()
        # Search across multiple tables
        # Display results with type badges
```

---

### 9. Profile Module
**File**: `ProfileModule.tsx`

**Layout**:
- Left: Avatar (96×96), name, role, last login
- Right: Editable fields (name, email, contact)
- Bottom: Borrowing history table

**Tkinter Implementation**:
```python
class ProfileFrame(ttk.Frame):
    def __init__(self):
        # Avatar (use PIL/Pillow for circular image)
        from PIL import Image, ImageTk, ImageDraw
        
        # Editable fields
        self.name_entry = ttk.Entry()
        self.email_entry = ttk.Entry()
        
        # History table
        self.history_tree = ttk.Treeview(columns=('tool', 'bdate', 'rdate', 'status'))
```

---

### 10. Help Module
**File**: `HelpModule.tsx`

**Expanded Content**:
- FAQs (collapsible/accordion)
- System Manual (requirements, dependencies)
- Help Guides with step-by-step tutorials
- Contact Admin form

**Tkinter Implementation**:
```python
class HelpFrame(ttk.Frame):
    def __init__(self):
        # Left navigation
        self.topic_listbox = tk.Listbox()
        
        # Right content area (use tk.Text widget)
        self.content_text = tk.Text(wrap='word', state='disabled')
        
        # Contact form
        self.subject_entry = ttk.Entry()
        self.message_text = tk.Text(height=6)
```

**Topics**:
1. FAQs
2. Getting Started
3. System Manual & Requirements
4. Inventory Management
5. Borrowing & Return
6. Reports
7. Account Settings

---

### 11. Maintenance Module
**File**: `MaintenanceModule.tsx`

**Features**:
- Data Maintenance: search by PID/Tag
- Batch Actions: import CSV, mass update
- Backup & Restore (.sql files)
- System Logs viewer
- Archive All Inactive (NOT delete)

**Tkinter Implementation**:
```python
class MaintenanceFrame(ttk.Frame):
    def __init__(self):
        # Backup
        self.backup_btn = ttk.Button(text="Create Backup", command=self.create_backup)
        
        # Logs viewer
        self.log_text = tk.Text(height=10, bg='black', fg='#2EA44F', font=('Courier', 10))
        
        # Archive confirmation
        self.archive_entry = ttk.Entry()  # Type "ARCHIVE" to confirm
        
    def create_backup(self):
        import shutil
        import datetime
        timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        shutil.copy('database.db', f'backup_{timestamp}.db')
```

---

## Styling Guide (Tkinter)

### Color Configuration
```python
# Configure ttk styles
style = ttk.Style()
style.theme_use('clam')

# Primary Green Button
style.configure('Green.TButton',
    background='#2C5E2E',
    foreground='white',
    borderwidth=0,
    relief='flat',
    padding=10
)

# Yellow Gradient Button
style.configure('Yellow.TButton',
    background='#F5D000',
    foreground='#1B1B1B',
    borderwidth=0,
    relief='flat',
    padding=10
)

# Archive Brown Button
style.configure('Brown.TButton',
    background='#A25E2D',
    foreground='white',
    borderwidth=0,
    relief='flat',
    padding=10
)
```

### Treeview (Table) Styling
```python
style.configure('Custom.Treeview',
    background='white',
    foreground='#1B1B1B',
    rowheight=40,
    fieldbackground='white',
    font=('Inter', 12)
)

style.configure('Custom.Treeview.Heading',
    background='#2C5E2E',
    foreground='white',
    font=('Inter', 12, 'bold'),
    borderwidth=0
)

# Alternating row colors
def striped_rows(tree):
    tree.tag_configure('oddrow', background='#FFFFFF')
    tree.tag_configure('evenrow', background='#F6F7F8')
```

### Modal Dialog
```python
class ConfirmModal(tk.Toplevel):
    def __init__(self, parent, title, message, on_confirm):
        super().__init__(parent)
        self.title(title)
        self.geometry('520x280')
        self.resizable(False, False)
        
        # Gradient header (2px)
        header = tk.Canvas(self, height=2, bg='#2C5E2E')
        header.pack(fill='x')
        
        # Content
        tk.Label(self, text=message, font=('Inter', 12)).pack(pady=20)
        
        # Buttons
        btn_frame = ttk.Frame(self)
        btn_frame.pack(pady=10)
        ttk.Button(btn_frame, text="Cancel", command=self.destroy).pack(side='left', padx=5)
        ttk.Button(btn_frame, text="Confirm", command=on_confirm, style='Green.TButton').pack(side='left')
        
        # Focus trap
        self.transient(parent)
        self.grab_set()
        
        # Keyboard shortcuts
        self.bind('<Escape>', lambda e: self.destroy())
        self.bind('<Return>', lambda e: on_confirm())
```

## Data Validation Rules

1. **Required Fields**: Flag with red border and error message
2. **Numeric Fields**: Price >= 0, Quantity >= 0 (integer)
3. **Email Format**: Must contain '@' and '.'
4. **Password**: Min 8 characters (recommended)
5. **Archive Confirmation**: Must type "ARCHIVE" exactly
## Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `Enter` | Confirm modal / Submit form |
| `Escape` | Close modal / Cancel |
| `Tab` | Navigate fields (top-down, left-right) |
| `Double-click` | Edit table row |

## Network & Database

### SQLite Setup (Single-User)
```python
import sqlite3
conn = sqlite3.connect('champion_tools.db')
```

### MySQL Setup (LAN Multi-User)
```python
import mysql.connector
conn = mysql.connector.connect(
    host='192.168.1.100',  # LAN server IP
    user='champion_user',
    password='secure_password',
    database='champion_tools'
)
```

### Backup Schedule
- Automatic daily backup at 11:00 PM
- Manual backup via Maintenance module
- Format: `champion_backup_YYYYMMDD.sql`

## Security Notes

1. **No Deletion**: Use ARCHIVE status to preserve audit trails
2. **Role-Based Access**: Admin vs Staff permissions
3. **Password Storage**: Use bcrypt or similar hashing
4. **Session Management**: Track login/logout times
5. **Network Security**: LAN-only, no internet exposure

## Testing Checklist

- [ ] All forms validate required fields
- [ ] Archive functionality works (no delete)
- [ ] Tables support double-click editing
- [ ] Modals respond to Enter/Escape keys
- [ ] QR code generation and preview works
- [ ] Date pickers use tkcalendar
- [ ] PDF/CSV export functions correctly
- [ ] Backup/restore preserves all data
- [ ] Status badges display correct colors
- [ ] Toast notifications auto-dismiss after 4s

## Deployment

1. Package with PyInstaller: `pyinstaller --onefile --windowed main.py`
2. Include logo image (48×48 PNG) in assets folder
3. Bundle database schema SQL file
4. Provide LAN setup instructions
5. Document admin credentials

---

**Version**: 1.0  
**Last Updated**: October 14, 2025  
**Developer**: Champion Fine Tooling Corporation IT Team
