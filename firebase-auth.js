// تكوين Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBRgEBLW3uSL6nrQNoMPwhM6yKFrNzThj4",
  authDomain: "crossplay-store.firebaseapp.com",
  databaseURL: "https://crossplay-store-default-rtdb.firebaseio.com",
  projectId: "crossplay-store",
  storageBucket: "crossplay-store.appspot.com",
  messagingSenderId: "918790495368",
  appId: "1:918790495368:web:830e3a8c399c9e62c3d33d"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// الحصول على مراجع للخدمات
const auth = firebase.auth();
const db = firebase.firestore();

// التحقق من حالة المصادقة
auth.onAuthStateChanged(user => {
  if (user) {
    console.log("تم تسجيل الدخول:", user.email);
    // تحديث واجهة المستخدم عند تسجيل الدخول
    updateUIOnLogin(user);
  } else {
    console.log("لم يتم تسجيل الدخول");
    // تحديث واجهة المستخدم عند تسجيل الخروج
    updateUIOnLogout();
  }
});

// تحديث واجهة المستخدم عند تسجيل الدخول
function updateUIOnLogin(user) {
  // تحديث القائمة المنسدلة
  const dropdownMenu = document.getElementById('dropdown');
  if (dropdownMenu) {
    dropdownMenu.innerHTML = `
      <a href="profile.html">الملف الشخصي</a>
      <a href="orders.html">طلباتي</a>
      <a href="#" onclick="logout()">تسجيل خروج</a>
    `;
    
    // التحقق مما إذا كان المستخدم مديرًا
    checkIfAdmin(user.uid);
  }
}

// تحديث واجهة المستخدم عند تسجيل الخروج
function updateUIOnLogout() {
  // تحديث القائمة المنسدلة
  const dropdownMenu = document.getElementById('dropdown');
  if (dropdownMenu) {
    dropdownMenu.innerHTML = `
      <a href="login.html">تسجيل دخول</a>
      <a href="signup.html">إنشاء حساب</a>
    `;
  }
}

// التحقق مما إذا كان المستخدم مديرًا
async function checkIfAdmin(userId) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists && userDoc.data().isAdmin) {
      // إضافة رابط لوحة التحكم للمدير
      const dropdownMenu = document.getElementById('dropdown');
      if (dropdownMenu) {
        const firstChild = dropdownMenu.firstChild;
        const adminLink = document.createElement('a');
        adminLink.href = 'admin.html';
        adminLink.textContent = 'لوحة التحكم';
        dropdownMenu.insertBefore(adminLink, firstChild);
      }
    }
  } catch (error) {
    console.error("خطأ في التحقق من صلاحيات المدير:", error);
  }
}

// تسجيل الدخول
async function login(email, password) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("خطأ في تسجيل الدخول:", error);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

// إنشاء حساب جديد
async function signup(email, password, displayName) {
  try {
    // إنشاء المستخدم
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    
    // تحديث اسم العرض
    await userCredential.user.updateProfile({
      displayName: displayName
    });
    
    // التحقق مما إذا كان هذا أول مستخدم (ليكون مديرًا)
    const usersSnapshot = await db.collection('users').get();
    const isFirstUser = usersSnapshot.size === 0;
    
    // إضافة معلومات المستخدم إلى Firestore
    await db.collection('users').doc(userCredential.user.uid).set({
      email: email,
      displayName: displayName,
      isAdmin: isFirstUser, // أول مستخدم يكون مديرًا
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("خطأ في إنشاء الحساب:", error);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

// تسجيل الخروج
async function logout() {
  try {
    await auth.signOut();
    window.location.href = 'index.html';
  } catch (error) {
    console.error("خطأ في تسجيل الخروج:", error);
    alert("حدث خطأ أثناء تسجيل الخروج");
  }
}

// الحصول على رسالة خطأ مناسبة باللغة العربية
function getErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'البريد الإلكتروني غير مسجل';
    case 'auth/wrong-password':
      return 'كلمة المرور غير صحيحة';
    case 'auth/email-already-in-use':
      return 'البريد الإلكتروني مستخدم بالفعل';
    case 'auth/weak-password':
      return 'كلمة المرور ضعيفة، يجب أن تكون 6 أحرف على الأقل';
    case 'auth/invalid-email':
      return 'البريد الإلكتروني غير صالح';
    default:
      return 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى';
  }
}

