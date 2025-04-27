import { type NextRequest, NextResponse } from "next/server"

// Datos simulados de usuarios para demostración
const mockUsers = [
  {
    id: "123456789",
    name: "Roblox_Player1",
    displayName: "Pro Gamer",
    description:
      "مرحبًا! أنا لاعب روبلوكس محترف وأحب تصميم الألعاب وتطويرها. أقضي معظم وقتي في لعب Adopt Me و Blox Fruits.",
    created: "2018-05-15T10:30:00Z",
    isBanned: false,
    avatar:
      "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-B0D0FFC7CCDDE9661B29A26BA7A2E2E1-Png/150/150/AvatarHeadshot/Png/noFilter",
    presence: { userPresenceType: 1, lastLocation: "Adopt Me" },
    premium: true,
    friendsCount: 487,
    followersCount: 2345,
    followingCount: 156,
    placeVisits: 78950,
    badges: ["مطور محترف", "مصمم ألعاب", "لاعب نشط"],
  },
  {
    id: "987654321",
    name: "BuilderPro",
    displayName: "Master Builder",
    description: "مصمم مباني ومطور ألعاب. أعمل على مشاريع كبيرة في روبلوكس وأقدم خدمات التصميم.",
    created: "2017-02-20T15:45:00Z",
    isBanned: false,
    avatar:
      "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-E19FB00F1EDEE8C6D94D5B9E11A0F3D4-Png/150/150/AvatarHeadshot/Png/noFilter",
    presence: { userPresenceType: 2, lastLocation: "Studio" },
    premium: true,
    friendsCount: 215,
    followersCount: 5678,
    followingCount: 89,
    placeVisits: 456789,
    badges: ["مصمم محترف", "مطور ألعاب", "فنان"],
  },
  {
    id: "456789123",
    name: "GamerGirl",
    displayName: "Princess Gamer",
    description: "أحب ألعاب المغامرات والألغاز. أقضي وقتي في اللعب مع أصدقائي وتصميم الأزياء في روبلوكس.",
    created: "2019-11-10T08:20:00Z",
    isBanned: false,
    avatar:
      "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-F5E5E5F5E5E5E5E5E5E5E5E5E5E5E5E5-Png/150/150/AvatarHeadshot/Png/noFilter",
    presence: { userPresenceType: 0, lastLocation: "Offline" },
    premium: false,
    friendsCount: 732,
    followersCount: 1234,
    followingCount: 321,
    placeVisits: 23456,
    badges: ["مصممة أزياء", "لاعبة نشطة"],
  },
  {
    id: "111222333",
    name: "DevKing",
    displayName: "Developer King",
    description: "مطور ألعاب محترف مع خبرة أكثر من 5 سنوات في روبلوكس. أعمل على مشاريع كبيرة وأقدم دورات تدريبية.",
    created: "2016-07-05T12:15:00Z",
    isBanned: false,
    avatar: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-A1B2C3D4E5F6G7H8I9J0-Png/150/150/AvatarHeadshot/Png/noFilter",
    presence: { userPresenceType: 3, lastLocation: "Working in Studio" },
    premium: true,
    friendsCount: 189,
    followersCount: 12345,
    followingCount: 76,
    placeVisits: 1234567,
    badges: ["مطور محترف", "معلم", "خبير برمجة"],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    if (!username) {
      return NextResponse.json({ error: "اسم المستخدم مطلوب" }, { status: 400 })
    }

    // Buscar en los datos simulados
    const foundUser = mockUsers.find(
      (user) =>
        user.name.toLowerCase() === username.toLowerCase() || user.displayName.toLowerCase() === username.toLowerCase(),
    )

    if (foundUser) {
      return NextResponse.json(foundUser)
    }

    // Si no se encuentra, crear un usuario simulado con el nombre proporcionado
    const randomIndex = Math.floor(Math.random() * mockUsers.length)
    const randomUser = { ...mockUsers[randomIndex] }

    randomUser.name = username
    randomUser.displayName = username
    randomUser.id = Math.floor(Math.random() * 1000000000).toString()
    randomUser.created = new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000).toISOString()
    randomUser.isBanned = Math.random() > 0.9 // 10% probabilidad de estar baneado
    randomUser.premium = Math.random() > 0.5 // 50% probabilidad de ser premium
    randomUser.avatar = `/placeholder.svg?height=420&width=420&text=${encodeURIComponent(username)}`

    return NextResponse.json(randomUser)
  } catch (error) {
    console.error("Error generating mock user:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء إنشاء بيانات المستخدم" }, { status: 500 })
  }
}
