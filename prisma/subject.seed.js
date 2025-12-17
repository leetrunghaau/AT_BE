const { PrismaClient, Color } = require('@prisma/client');
const { randomUUID } = require('crypto');

const prisma = new PrismaClient();

const subjectsToCreate = [

  { id: 'MATH-SCI', name: 'Toán', color: Color.Red },
  { id: 'PHYS-SCI', name: 'Vật lý', color: Color.Blue },
  { id: 'CHEM-SCI', name: 'Hóa học', color: Color.Green },
  { id: 'BIO-SCI', name: 'Sinh học', color: Color.Yellow },
  { id: 'LIT-SOC', name: 'Ngữ văn', color: Color.Purple },
  { id: 'HIST-SOC', name: 'Lịch sử', color: Color.Orange },
  { id: 'GEO-SOC', name: 'Địa lý', color: Color.Pink },
  { id: 'ENG-LNG', name: 'Tiếng Anh', color: Color.Indigo },
  { id: 'FLL-LNG', name: 'Ngoại ngữ khác', color: Color.Blue },
  { id: 'CIT-SOC', name: 'Giáo dục công dân', color: Color.Green },
  { id: 'NPD-SOC', name: 'Giáo dục quốc phòng và an ninh', color: Color.Red },
  { id: 'PE-PE', name: 'Thể dục', color: Color.Orange },
  { id: 'IT-SCI', name: 'Tin học', color: Color.Indigo },
  { id: 'TECH-SCI', name: 'Công nghệ', color: Color.Yellow },
  { id: 'MUS-ART', name: 'Âm nhạc', color: Color.Pink },
  { id: 'ART-ART', name: 'Mỹ thuật', color: Color.Purple },
];


async function main() {
  console.log(`Bắt đầu seeding bảng Subject...`);

  await prisma.subject.deleteMany({
    where: {
      id: {
        in: subjectsToCreate.map(s => s.id)
      }
    }
  });

  const createdSubjects = await prisma.subject.createMany({
    data: subjectsToCreate,
    skipDuplicates: true, // Bỏ qua nếu id đã tồn tại
  });

  console.log(`Seeding hoàn tất.`);
  console.log(`Đã tạo thành công ${createdSubjects.count} môn học.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
