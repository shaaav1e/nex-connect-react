# 🧪 Testing Guide for React Router Investor-Entrepreneur Platform

## 🚀 **How to Test the Application**

### **Prerequisites**

- Both servers should be running:
  - **Mock API Server**: `http://localhost:3001` (JSON Server)
  - **React App**: `http://localhost:5174` (Vite dev server)

### **1. 📋 API Endpoints Testing**

**Visit**: `http://localhost:5174/api-test.html`

This page automatically tests all mock API endpoints:

- ✅ **GET /entrepreneurs** - Retrieves all entrepreneur profiles
- ✅ **GET /investors** - Retrieves all investor profiles
- ✅ **GET /collaborationRequests** - Retrieves collaboration requests
- ✅ **GET /users** - Retrieves authentication users

**Expected Result**: All endpoints should return green success responses with JSON data.

---

### **2. 🔐 Authentication Testing**

**Visit**: `http://localhost:5174/login`

#### **Test Credentials**:

```
Investor Login:
- Email: investor@example.com
- Password: password123
- Role: Investor

Entrepreneur Login:
- Email: entrepreneur@example.com
- Password: password123
- Role: Entrepreneur
```

#### **Test Cases**:

1. **Valid Login**: Use credentials above → Should redirect to appropriate dashboard
2. **Invalid Email**: Try wrong email → Should show "Login failed" error
3. **Invalid Password**: Try wrong password → Should show "Login failed" error
4. **Form Validation**:
   - Empty fields → Should show field-specific errors
   - Invalid email format → Should show "Email is invalid"
   - Short password → Should show "Password must be at least 6 characters"

---

### **3. 📝 Registration Testing**

**Visit**: `http://localhost:5174/register`

#### **Test Cases**:

1. **Valid Registration**: Fill all fields correctly → Should redirect to login
2. **Email Validation**: Try invalid emails → Should show validation errors
3. **Password Confirmation**: Use different passwords → Should show "Passwords don't match"
4. **Role Selection**: Test both Investor and Entrepreneur roles

---

### **4. 💼 Investor Dashboard Testing**

**Access**: Login as investor OR visit `http://localhost:5174/dashboard/investor`

#### **Expected Features**:

- ✅ **Quick Stats Cards**:

  - Total Entrepreneurs (should show 6)
  - Investment Opportunities (should show 5 - excluding Series B)
  - Portfolio Value ($2.5M)

- ✅ **Entrepreneurs List**:
  - 6 entrepreneur cards with photos, names, startups
  - "View Full Profile" buttons
  - Hover effects on cards

#### **Test Cases**:

1. **Data Loading**: Should show "Loading entrepreneurs..." then display cards
2. **Profile Navigation**: Click "View Full Profile" → Should navigate to profile page
3. **Responsive Design**: Resize window → Cards should reorganize in grid
4. **Error Handling**: Stop API server → Should show error with "Retry" button

---

### **5. 🚀 Entrepreneur Dashboard Testing**

**Access**: Login as entrepreneur OR visit `http://localhost:5174/dashboard/entrepreneur`

#### **Expected Features**:

- ✅ **Quick Stats Cards**:

  - Total Requests (should show 5)
  - Pending Reviews (should show 3)
  - Accepted Offers (should show 1)

- ✅ **Collaboration Requests**:
  - 5 investor request cards
  - Status badges (Pending/Accepted/Declined)
  - Interactive buttons (Accept/Decline for pending)
  - "View Profile" links

#### **Test Cases**:

1. **Accept Request**: Click "Accept" on pending request → Status should change to "Accepted"
2. **Decline Request**: Click "Decline" on pending request → Status should change to "Declined"
3. **View Investor Profile**: Click "View Profile" → Should navigate to investor profile
4. **Status Colors**:
   - Pending → Yellow badge
   - Accepted → Green badge
   - Declined → Red badge

---

### **6. 👤 Profile Pages Testing**

#### **Entrepreneur Profiles**:

**Visit**: `http://localhost:5174/profile/entrepreneur/1` (replace 1 with IDs 1-6)

#### **Investor Profiles**:

**Visit**: `http://localhost:5174/profile/investor/1` (replace 1 with IDs 1-5)

#### **Test Cases**:

1. **Profile Data**: Should display detailed information from API
2. **Navigation**: "Back to Dashboard" should work correctly
3. **Different IDs**: Test with various profile IDs
4. **404 Handling**: Test with non-existent ID (e.g., ID 999)

---

### **7. 🧭 Navigation Testing**

#### **Sidebar Navigation**:

- ✅ **Investor Sidebar**: Dashboard, Opportunities, Portfolio, Profile
- ✅ **Entrepreneur Sidebar**: Dashboard, Projects, Collaboration, Profile

#### **Test Cases**:

1. **Role-Based Menus**: Different menu items based on user type
2. **Active States**: Current page should be highlighted
3. **Navigation Links**: All links should work correctly
4. **Responsive**: Sidebar should collapse on mobile

---

### **8. 🔄 Real-time Features Testing**

#### **API Integration**:

1. **Live Data Updates**: Changes in `db.json` should reflect immediately
2. **Status Changes**: Accept/Decline actions should update database
3. **Error Recovery**: API failures should show appropriate messages

#### **Test Cases**:

1. **Modify Database**: Edit `db.json` → Changes should appear in UI
2. **API Downtime**: Stop JSON server → Should show error states
3. **Network Issues**: Test with slow connection

---

### **9. 📱 Responsive Design Testing**

#### **Breakpoints to Test**:

- **Mobile**: 375px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

#### **Features to Verify**:

- Card grid layouts adjust properly
- Sidebar becomes collapsible
- Text remains readable
- Buttons stay accessible

---

### **10. ⚡ Performance Testing**

#### **Metrics to Check**:

- **Initial Load**: < 2 seconds
- **API Responses**: < 500ms (local server)
- **Navigation**: Instant with React Router
- **Bundle Size**: Check dev tools Network tab

---

### **🔧 Troubleshooting**

#### **Common Issues**:

1. **"Module not found" errors**:

   ```bash
   npm install
   npm run dev:full
   ```

2. **API connection issues**:

   - Verify JSON Server is running on port 3001
   - Check `http://localhost:3001/entrepreneurs` directly

3. **Port conflicts**:

   - JSON Server: Change port in `package.json` scripts
   - React App: Vite will auto-assign available port

4. **CORS issues** (shouldn't occur with local setup):
   - Both servers running on localhost
   - Axios configured for same origin

---

### **🎯 Success Criteria**

**✅ All tests pass when**:

- All API endpoints return data
- Authentication works with test credentials
- Dashboards display correct data and stats
- Interactive features (Accept/Decline) work
- Navigation between pages is smooth
- Error handling works gracefully
- Responsive design adapts to screen sizes

---

### **📊 Performance Benchmarks**

**Expected Load Times**:

- **Login Page**: < 1s
- **Dashboard**: < 2s
- **Profile Pages**: < 1s
- **API Calls**: < 500ms (local)

**Bundle Sizes** (approx):

- **JS Bundle**: ~800KB (dev mode)
- **CSS Bundle**: ~200KB
- **Assets**: ~50KB

---

**Happy Testing! 🚀**
