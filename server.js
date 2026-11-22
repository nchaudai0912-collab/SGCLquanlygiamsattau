const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'db.json');

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use('/uploads', express.static(UPLOAD_DIR));
app.use(express.static(path.join(__dirname, 'public')));

const SEED_DB = {
  vessels: [
    {
      id: 1, name: 'MV New Hope', voyage: '24-10', cargo: 'Gỗ tròn', type: 'Nhập khẩu',
      port: 'Cảng Khánh Hội', berth: 'Cầu K2', eta: '2026-11-22T06:00', status: 'Đang theo dõi',
      agent: 'Trương Nguyễn Bảo Ngọc', note: 'Hồ sơ chuyến tàu mẫu chuẩn quy trình CP1–CP3.', phase: 2,
      recon: { unit: 'MT', tol: 0.5, bl: 12500, ds: 12480, roroc: 12465 }
    }
  ],
  cks: { '1_1_0': true, '1_1_1': true, '1_1_2': true, '1_1_3': true },
  logs: [
    { id: 101, vesselId: 1, time: '2026-11-22T08:30', shift: 'Ca 1 (06–14)', qty: '3200 MT', type: 'Diễn biến dỡ hàng (ghi nhận)', title: 'Dỡ hàng ca 1 thuận lợi tại hầm 1 & 2', person: 'Trương Nguyễn Bảo Ngọc', detail: '2 cẩu bờ hoạt động liên tục, thời tiết khô ráo.' },
    { id: 102, vesselId: 1, time: '2026-11-22T15:15', shift: 'Ca 2 (14–22)', qty: '2850 MT', type: 'Diễn biến dỡ hàng (ghi nhận)', title: 'Tiếp tục dỡ gỗ tròn ca 2', person: 'Trương Nguyễn Bảo Ngọc', detail: 'Chú ý gió tăng nhẹ cuối ca.' }
  ],
  daily: [
    { id: 201, vesselId: 1, date: '2026-11-22', person: 'Trương Nguyễn Bảo Ngọc', from: '06:00', to: '14:00', content: 'Hoàn tất thủ tục nhập cảnh và mở nắp hầm 1 & 2. Sản lượng ca 1 đạt 3.200 MT.', imgs: [] }
  ],
  events: [
    { id: 301, vesselId: 1, time: '2026-11-22T05:30', type: 'Tàu đến / Arrival', title: 'Tàu đến trạm hoa tiêu (EOSP)', person: 'Trương Nguyễn Bảo Ngọc', source: 'VHF / Thuyền trưởng', cause: '', detail: 'Tàu thả neo chờ hoa tiêu đúng kế hoạch.' },
    { id: 302, vesselId: 1, time: '2026-11-22T06:00', type: 'NOR / Notice of Readiness', title: 'Trao Thông báo sẵn sàng (NOR Tendered)', person: 'Trương Nguyễn Bảo Ngọc', source: 'Email NOR xác nhận', cause: '', detail: 'Đã gửi đại diện chủ hàng.' },
    { id: 303, vesselId: 1, time: '2026-11-22T08:00', type: 'Bắt đầu làm hàng', title: 'Bắt đầu dỡ hàng hầm 1 & 2', person: 'Trương Nguyễn Bảo Ngọc', source: 'Biên bản cảng Khánh Hội', cause: '', detail: 'Sau khi giám định mớn nước đầu.' }
  ],
  photos: [],
  docs: [
    { id: 401, vesselId: 1, name: 'Arrival Notice', type: 'Arrival Notice', date: '2026-11-21', status: 'Đã tải lên', note: 'AN_MV_New_Hope.pdf' },
    { id: 402, vesselId: 1, name: 'Crew List', type: 'Crew List', date: '2026-11-21', status: 'Đã tải lên', note: 'CrewList_24-10.pdf' },
    { id: 403, vesselId: 1, name: 'Bill of Lading (B/L)', type: 'Bill of Lading (B/L)', date: '2026-11-21', status: 'Đã tải lên', note: 'BL_12500MT.pdf' },
    { id: 404, vesselId: 1, name: 'Notice of Readiness (NOR)', type: 'Notice of Readiness (NOR)', date: '2026-11-22', status: 'Đã tải lên', note: 'NOR_Signed.pdf' }
  ],
  handovers: [
    { id: 501, vesselId: 1, date: '2026-11-22', shift: 'Ca 1 (06–14)', from: 'Trương Nguyễn Bảo Ngọc', to: 'Trần Thị Lan', detail: 'Sản lượng ca 1 đạt 3.200 MT, bàn giao tiếp tục theo dõi ca 2.', time: '2026-11-22T14:05' }
  ]
};

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    writeDB(SEED_DB);
    return JSON.parse(JSON.stringify(SEED_DB));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDB(data) {
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, DB_FILE);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '.jpg').toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

app.get('/api/bootstrap', (_req, res) => {
  res.json(readDB());
});

app.post('/api/sync', (req, res) => {
  const d = req.body || {};
  if (!Array.isArray(d.vessels)) return res.status(400).json({ error: 'Invalid payload' });
  writeDB({
    vessels: d.vessels,
    cks: d.cks || {},
    logs: d.logs || [],
    daily: d.daily || [],
    events: d.events || [],
    photos: d.photos || [],
    docs: d.docs || [],
    handovers: d.handovers || []
  });
  res.json({ ok: true });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.listen(PORT, () => {
  console.log(`SGCL Vessel Agency Server running at http://localhost:${PORT}`);
});
