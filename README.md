# ✦🔥 KABANE BOT 🔥✦

بوت واتساب RPG احترافي بتصميم Dark Fantasy

## 📋 المتطلبات

- **Node.js** 20.0.0 أو أعلى
- **npm** أو **yarn**
- حساب واتساب (Multi-Device)

## 🛠️ التثبيت

### 1. تثبيت Node.js

حمّل Node.js من الموقع الرسمي: https://nodejs.org

تأكد من استخدام الإصدار 20+.

### 2. تحميل المشروع

```bash
git clone https://github.com/your-repo/kabane-bot.git
cd kabane-bot
```

### 3. تثبيت المكتبات

```bash
npm install
```

### 4. إعداد config.js

افتح ملف `config.js` وعدّل:

```js
owner: ["212600000000"],  // ضع رقمك هنا
```

### 5. تشغيل البوت

```bash
npm start
```

### 6. الربط

ستظهر رسالة:

```
✦ كود الربط: XXXX-XXXX ✦
```

افتح واتساب على هاتفك:
1. اذهب إلى **الأجهزة المرتبطة**
2. اختر **إ Basement جهاز**
3. أدخل الكود

### 7. التشغيل

بعد الربط بنجاح سترى:

```
✦🔥 KABANE BOT متصل بنجاح 🔥✦
```

## 📦 تشغيل مع PM2

```bash
npm install -g pm2
pm2 start index.js --name kabane-bot
pm2 save
pm2 startup
```

## ➕ إضافة Plugin

أنشئ ملف جديد في مجلد `plugins/`:

```js
let command = async (m, { conn, args }) => {
    await conn.sendMessage(m.chat, { text: 'مرحبا!' }, { quoted: m });
};

command.help = ['أمر اختبار'];
command.tags = ['rpg'];
command.command = ['test', 'اختبار'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 3;

export default command;
```

ثم أعد تشغيل البوت أو استخدم `.owner reload`.

## 📝 صيغة Command

| الخاصية | الوصف |
|---------|-------|
| `command.help` | وصف الأمر |
| `command.tags` | التصنيف |
| `command.command` | أسماء الأمر |
| `command.group` | يعمل في المجموعات فقط |
| `command.admin` | يحتاج مسؤول |
| `command.botAdmin` | البوت يحتاج مسؤول |
| `command.owner` | للمالك فقط |
| `command.limit` | يستهلك طاقة |
| `command.cooldown` | وقت التهدئة بالثواني |

## 💾 Database

البيانات محفوظة في `database.json` تلقائياً.

### النسخ الاحتياطي

```bash
copy database.json database_backup.json
```

### استعادة النسخة

```bash
copy database_backup.json database.json
```

## 🔄 تحديث البوت

```bash
git pull
npm install
pm2 restart kabane-bot
```

## ⚙️ الأوامر

### RPG
- `.register` - التسجيل
- `.profile` - الملف الشخصي
- `.hunt` - الصيد
- `.mine` - التعدين
- `.fish` - الصيد
- `.battle` - القتال
- `.boss` - معركة Boss
- `.dungeon` - الزنزانة
- `.pvp` - معركة لاعب ضد لاعب

### الاقتصاد
- `.work` - العمل
- `.daily` - المكافأة اليومية
- `.weekly` - المكافأة الأسبوعية
- `.shop` - المتجر
- `.buy` - الشراء
- `.sell` - البيع
- `.balance` - الرصيد
- `.bank` - البنك
- `.deposit` - إيداع
- `.withdraw` - سحب

### الاجتماعية
- `.clan` - العشيرة
- `.marry` - الزواج
- `.divorce` - الطلاق

### الوسائط
- `.sticker` - ملصق

### الإدارة
- `.add` - إضافة عضو
- `.kick` - طرد عضو
- `.promote` - ترقية
- `.demote` - تنزيل
- `.ban` - حظر
- `.unban` - إلغاء حظر
- `.tagall` - استدعاء الجميع

### المالك
- `.owner` - أوامر المالك

## 🔒 أمان

- أوامر المالك محمية
- `.eval` و `.exec` للمالك فقط
- حماية ضد Command Injection
- حماية قاعدة البيانات

## 📄 الرخصة

MIT License

---

✦🔥 KABANE BOT 🔥✦ - Dark Fantasy RPG
