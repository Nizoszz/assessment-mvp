-- CreateTable
CREATE TABLE "Analysis" (
    "analysisId" TEXT NOT NULL,
    "resumeText" TEXT NOT NULL,
    "jobText" TEXT NOT NULL,
    "analysis" TEXT NOT NULL,
    "matchScore" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("analysisId")
);
