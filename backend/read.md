

npx prism generate

npx prisma db push



//// model Inspection {
//   id                 Int                 @id @default(autoincrement())
//   projectName        String
//   description        String
//   startDate          DateTime            @default(now())
//   endDate            DateTime            @default(now())
//   User               User                @relation(fields: [userId], references: [id])
//   userId             Int
//   imageInspection    ImageInspection?
//   videoInspection    VideoInspection?
//   infrastructurePlan InfrastructurePlan?
// }

// model VideoInspection {
//   id           Int        @id @default(autoincrement())
//   title        String
//   path         String
//   addedDate    DateTime   @default(now())
//   Inspection   Inspection @relation(fields: [Inspectionid], references: [id])
//   Inspectionid Int        @unique
// }

// model ImageInspection {
//   id           Int        @id @default(autoincrement())
//   title        String
//   path         String
//   addedDate    DateTime   @default(now())
//   Inspection   Inspection @relation(fields: [Inspectionid], references: [id])
//   Inspectionid Int        @unique
// }

// model InfrastructurePlan {
//   id           Int        @id @default(autoincrement())
//   title        String
//   path         String
//   addedDate    DateTime   @default(now())
//   Inspection   Inspection @relation(fields: [Inspectionid], references: [id])
//   Inspectionid Int        @unique
// }

// model InspectionRapport {
//   id           Int      @id @default(autoincrement())
//   title        String
//   content      String
//   creationDate DateTime @default(now())
//   domage       Domage?  @relation(fields: [domageid], references: [id])
//   domageid     Int?     @unique
// }

// model Domage {
//   id                 Int                @id @default(autoincrement())
//   detectionTimestamp DateTime           @default(now())
//   category           String
//   postion            String
//   dangerDegree       Int
//   area               Float
//   inspectionRapport  InspectionRapport?
//   domageImage        DomageImage[]
// }

// model DomageImage {
//   id     Int    @id @default(autoincrement())
//   title  String
//   path   String
//   source String
//   mask   Float
//   bbox   Float

//   domage   Domage @relation(fields: [domageId], references: [id])
//   domageId Int
// }
