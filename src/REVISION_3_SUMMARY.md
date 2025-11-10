# Revision Set 3 - Access Control & UI Adjustments

## 📋 Summary of Changes

This revision implements comprehensive role-based access control, forgot password functionality, search features across modules, and staff-level permissions.

---

## 🔐 1. Login Screen Revisions

### Changes Made:
- ✅ **Removed "Register" button** - Registration now only accessible to Admin inside Registration & Verification module
- ✅ **Updated "Forgot Password"** - Now a text link that opens a modal
- ✅ **Added role-based login** - Supports Admin and Staff roles

### Demo Credentials:
```
Admin Login:
Username: admin
Password: admin

Staff Login:
Username: staff
Password: staff
```

### Implementation:
**File**: `/components/modules/LoginModule.tsx`
- Removed Register button
- Added Forgot Password link (opens modal)
- Login handler now accepts role parameter: `onLogin(role: 'Admin' | 'Staff')`

---

## 🛡️ 2. Forgot Password Module

### Features:
- **3-Step Flow**:
  1. Enter Email or Username → Send Verification Code
  2. Enter 6-digit Code + New Password + Confirm Password
  3. Success confirmation

### Specifications:
- Modal width: 400px
- Modal radius: 10px
- Keyboard shortcuts: Enter to submit, Escape to close

### Validation:
- ✅ Email/username required
- ✅ Password fields must match
- ✅ Code must be 6 digits
- ✅ Password minimum 8 characters

### Implementation:
**File**: `/components/modules/ForgotPasswordModule.tsx`
- New modal component
- Integrated into LoginModule
- Success toast: "Password reset successfully."

---

## 🗂️ 3. Sidebar Adjustments

### Admin Sidebar (13 items):
1. Dashboard
2. Employees (User Management)
3. Registration & Verification
4. Role Management
5. Products / Inventory
6. Tagging
7. Borrowing & Return
8. Tracking & Accountability
9. Reports
10. Search
11. Profile
12. Help
13. Maintenance

### Staff Sidebar (5 items):
1. Help
2. Products / Inventory (View-Only)
3. Borrowing & Return
4. Tracking & Accountability (Limited)
5. Profile

### Changes:
- ✅ **Removed "Exit"** - Logout already in header
- ✅ **Re-added modules**: Employees, Search, Profile (in sidebar), Maintenance
- ✅ **Role-based rendering**: Different menu items for Admin vs Staff

### Implementation:
**File**: `/components/Sidebar.tsx`
- Added `userRole` prop
- Separate menu arrays: `adminMenuItems` and `staffMenuItems`
- Conditional rendering based on role

---

## 🏷️ 4. Tagging Module - Search Functionality

### New Features:
- **Search Field**: Tag ID or Tool Name
- **Dropdown Filter**: Assigned / Unassigned / Archived
- **Search Button**: Green primary button
- **Clear Button**: Gray ghost button

### Behavior:
- Real-time filter of tag list as user types
- Clear resets table to full list
- Supports Tag ID partial match

### Updated Status Values:
- `Assigned` (instead of Active)
- `Unassigned` (instead of Inactive)
- `Archived`

### Implementation:
**File**: `/components/modules/TaggingModule.tsx`
- Added search bar above table
- Filter logic for tag ID and product name
- Clear function resets filters

---

## 🧾 5. Borrowing & Return Module - Search Functionality

### New Features:
- **Search Field**: Tag ID / Borrower Name / Transaction ID
- **Filter Dropdown**: Borrowed / Returned / Overdue
- **Date Range Picker**: From and To dates
- **Search & Clear buttons**

### Behavior:
- Staff can quickly find specific borrowed tools
- Admin sees full transaction logs
- Search results highlight matched rows

### Implementation:
**File**: `/components/modules/BorrowingModule.tsx`
- Added comprehensive search section
- Filter by search query, status, and date range
- Role-aware functionality (Staff sees only their transactions)

---

## 🧠 6. Staff-Level Access Control

### Staff Sidebar Items:
- Help Module
- Products / Inventory (View-Only)
- Borrowing & Return
- Tracking & Accountability (Limited)
- Profile

### Forgot Password Access:
- Accessible from Login screen (not sidebar)
- Staff can reset their own passwords

---

## 📊 7. Staff Module Permissions & UI States

| Module | Access Level | Restrictions | UI Behavior |
|--------|-------------|--------------|-------------|
| **Help Module** | Full | None | Can view FAQs, Guides, Manuals, Contact Admin |
| **Forgot Module** | Full | Accessible from Login only | Modal or separate screen; staff can reset their own passwords |
| **Products / Inventory** | View-Only | ❌ No add/update/archive | All form fields disabled; table rows selectable for view only. No action buttons visible |
| **Borrowing & Return** | Standard | Can only borrow & return own transactions | Tool scanning, searching, borrowing, returning. No editing of others' records |
| **Tracking & Accountability** | Limited View | ❌ No edit, ❌ No export | Table filters auto-limited to user's transactions only. Export buttons hidden |
| **Profile** | Full for self | ❌ No admin role settings | Edit personal info, change password, view borrowing history |

---

## 🧰 8. Implementation Details

### Products / Inventory (View-Only Mode)

**File**: `/components/modules/InventoryModule.tsx`

**Changes**:
- Added `isViewOnly` prop
- All form inputs disabled when `isViewOnly={true}`
- Action buttons (Save, Update, Archive, Clear) hidden for staff
- Header shows "(View Only)" label

**Props**:
```typescript
interface InventoryModuleProps {
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
  isViewOnly?: boolean; // NEW
}
```

**Tkinter Mapping**:
```python
# Disable fields
category_combo.config(state='disabled')
name_entry.config(state='disabled')

# Hide buttons
if role == "staff":
    save_btn.pack_forget()
    update_btn.pack_forget()
```

---

### Borrowing & Return (Role-Aware)

**File**: `/components/modules/BorrowingModule.tsx`

**Changes**:
- Added `userRole` prop
- Search functionality for Tag ID, Borrower, Transaction ID
- Status filter: Borrowed, Returned, Overdue
- Date range filtering

**Props**:
```typescript
interface BorrowingModuleProps {
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
  userRole: 'Admin' | 'Staff'; // NEW
}
```

**Behavior**:
- Staff: Can only borrow/return tools (borrower field locked to current user)
- Admin: Full access to all transactions

---

### Tracking & Accountability (Limited for Staff)

**File**: `/components/modules/TrackingModule.tsx`

**Changes**:
- Added `userRole` prop
- Auto-filter transactions for staff (shows only their own)
- Export buttons hidden for staff
- Label shows "(Your Transactions)" for staff

**Props**:
```typescript
interface TrackingModuleProps {
  onToast: (type: 'success' | 'error' | 'info', message: string) => void;
  userRole: 'Admin' | 'Staff'; // NEW
}
```

**Filter Logic**:
```typescript
const filteredTransactions = transactions.filter(t => {
  // Staff can only see their own transactions
  const matchUser = userRole === 'Admin' || t.borrower === currentUser;
  // ... other filters
  return matchUser && matchSearch && matchStatus;
});
```

**Tkinter Mapping**:
```python
# Auto-filter by logged-in user
if role == "staff":
    query = "SELECT * FROM transactions WHERE borrower_id = ?"
    cursor.execute(query, (current_user.id,))
else:
    query = "SELECT * FROM transactions"
    cursor.execute(query)

# Hide export buttons
if role == "staff":
    export_csv_btn.pack_forget()
    export_pdf_btn.pack_forget()
```

---

## 🖥️ 9. Tkinter Mapping for Role-Based UI

### Conditional Sidebar Rendering
```python
def render_sidebar(role):
    if role == "admin":
        menu_items = [
            'Dashboard', 'Employees', 'Registration', 'Role Management',
            'Inventory', 'Tagging', 'Borrowing', 'Tracking', 
            'Reports', 'Search', 'Profile', 'Help', 'Maintenance'
        ]
    elif role == "staff":
        menu_items = [
            'Help', 'Inventory', 'Borrowing', 'Tracking', 'Profile'
        ]
    
    for item in menu_items:
        btn = tk.Button(sidebar, text=item, command=lambda m=item: switch_module(m))
        btn.pack(fill='x')
```

### Disabled Fields/Buttons
```python
# In Inventory module
if role == "staff":
    # Disable all form fields
    category_combo.config(state='disabled')
    name_entry.config(state='disabled')
    price_entry.config(state='disabled')
    qty_entry.config(state='disabled')
    status_combo.config(state='disabled')
    
    # Hide action buttons
    save_btn.pack_forget()
    update_btn.pack_forget()
    archive_btn.pack_forget()
```

### Auto-filter in Tracking Module
```python
# Staff sees only their own transactions
if role == "staff":
    query = """
        SELECT * FROM transactions 
        WHERE borrower_id = ? 
        ORDER BY borrow_date DESC
    """
    cursor.execute(query, (current_user_id,))
else:
    query = "SELECT * FROM transactions ORDER BY borrow_date DESC"
    cursor.execute(query)
```

### Role Check on Borrowing Actions
```python
def handle_borrow():
    if role == "staff":
        # Lock borrower to current user
        borrower_entry.delete(0, tk.END)
        borrower_entry.insert(0, current_user.name)
        borrower_entry.config(state='readonly')
    else:
        # Admin can borrow for anyone
        borrower_entry.config(state='normal')
```

### Export Button Removal
```python
# In Tracking module
if role == "staff":
    export_csv_btn.pack_forget()
    export_pdf_btn.pack_forget()
else:
    export_csv_btn.pack(side='left', padx=5)
    export_pdf_btn.pack(side='left', padx=5)
```

---

## 📝 10. App.tsx Role Management

**File**: `/App.tsx`

**Changes**:
- Added `userRole` state: `'Admin' | 'Staff'`
- Login handler sets role: `handleLogin(role: UserRole)`
- Default module based on role:
  - Admin → Dashboard
  - Staff → Help
- All modules receive appropriate props (userRole, isViewOnly)

**State Management**:
```typescript
const [userRole, setUserRole] = useState<UserRole>('Admin');

const handleLogin = (role: UserRole) => {
  setUserRole(role);
  setIsLoggedIn(true);
  // Set default module based on role
  if (role === 'Staff') {
    setActiveModule('help');
  } else {
    setActiveModule('dashboard');
  }
};
```

**Conditional Rendering**:
```typescript
{activeModule === 'inventory' && (
  <InventoryModule onToast={addToast} isViewOnly={userRole === 'Staff'} />
)}
{activeModule === 'borrowing' && (
  <BorrowingModule onToast={addToast} userRole={userRole} />
)}
{activeModule === 'tracking' && (
  <TrackingModule onToast={addToast} userRole={userRole} />
)}
```

---

## ✅ Testing Checklist

### Login & Authentication
- [ ] Admin login with credentials (admin/admin)
- [ ] Staff login with credentials (staff/staff)
- [ ] Forgot Password modal opens from login
- [ ] Forgot Password 3-step flow works
- [ ] Password validation (match, length)
- [ ] Success toast on password reset

### Sidebar Navigation
- [ ] Admin sees 13 menu items
- [ ] Staff sees 5 menu items
- [ ] Active module highlighted correctly
- [ ] Module switching works

### Products / Inventory
- [ ] Admin can Save, Update, Archive
- [ ] Staff sees "(View Only)" label
- [ ] Staff cannot edit any fields
- [ ] Staff cannot see action buttons
- [ ] Table selection works for both roles

### Tagging Module (Admin Only)
- [ ] Search by Tag ID works
- [ ] Search by Tool Name works
- [ ] Status filter (Assigned/Unassigned/Archived)
- [ ] Clear button resets filters

### Borrowing & Return
- [ ] Search section displays
- [ ] Search by Tag ID/Borrower/Trans ID
- [ ] Status filter works
- [ ] Date range filters work
- [ ] Clear button resets all filters
- [ ] Staff can borrow/return tools

### Tracking & Accountability
- [ ] Admin sees all transactions
- [ ] Staff sees only their own transactions
- [ ] Staff sees "(Your Transactions)" label
- [ ] Export buttons visible for Admin only
- [ ] Export buttons hidden for Staff

### General
- [ ] No console errors
- [ ] All navigation works
- [ ] Toasts display correctly
- [ ] Modals open and close properly

---

## 🚀 Deployment Notes

### Database Considerations

**Users Table** (add role column):
```sql
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'Staff' CHECK(role IN ('Admin', 'Staff'));
```

**Session Management**:
```python
class UserSession:
    def __init__(self, user_id, username, role):
        self.user_id = user_id
        self.username = username
        self.role = role  # 'Admin' or 'Staff'
        self.logged_in_at = datetime.now()
```

### Security Best Practices
1. **Password Hashing**: Use bcrypt or similar
2. **Session Tokens**: Implement secure session management
3. **Role Validation**: Always verify role on server side
4. **Audit Logging**: Log all admin actions
5. **Password Reset**: Send actual verification codes via email

---

## 📚 Migration Guide

### From Version 2.0 to 3.0:

1. **Add ForgotPasswordModule**:
   - Create `/components/modules/ForgotPasswordModule.tsx`
   - Integrate into LoginModule

2. **Update LoginModule**:
   - Remove Register button
   - Add Forgot Password link
   - Update `onLogin` to accept role parameter

3. **Update App.tsx**:
   - Add `userRole` state
   - Pass `userRole` to Sidebar
   - Pass appropriate props to modules

4. **Update Sidebar**:
   - Add `userRole` prop
   - Create admin and staff menu arrays
   - Conditional rendering

5. **Update InventoryModule**:
   - Add `isViewOnly` prop
   - Disable fields when view-only
   - Hide buttons for staff

6. **Update BorrowingModule**:
   - Add `userRole` prop
   - Add search functionality
   - Implement filters

7. **Update TaggingModule**:
   - Add search bar
   - Add status filter
   - Update status values

8. **Update TrackingModule**:
   - Add `userRole` prop
   - Filter transactions by user role
   - Hide export buttons for staff

---

## 🎓 Key Takeaways

1. **Role-Based Access**: Complete separation of Admin and Staff permissions
2. **View-Only Mode**: Staff can view inventory but not modify
3. **Data Filtering**: Staff see only their own transactions
4. **Search Everywhere**: All major modules have integrated search
5. **Security First**: Proper validation and role checks
6. **User Experience**: Clear labels and intuitive restrictions

---

**Version**: 3.0  
**Release Date**: October 14, 2025  
**Breaking Changes**: Yes (role-based props added to multiple components)  
**Migration Required**: Yes (see Migration Guide above)  
**Backward Compatible**: No (requires updates to all module calls)
