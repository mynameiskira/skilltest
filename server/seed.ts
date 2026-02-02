import sequelize from './src/config/database.js';
import { User, Test, Question, Result } from './src/models/index.js';
import bcrypt from 'bcryptjs';

async function seed() {
    try {
        await sequelize.sync({ force: true });

        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create Admin
        const admin = await User.create({
            username: 'System Admin',
            email: 'admin@skilltest.com',
            password: hashedPassword,
            role: 'admin'
        });

        // Create Recruiters
        const r1 = await User.create({ username: 'John Recruiter', email: 'john@company.com', password: hashedPassword, role: 'recruiter' });
        const r2 = await User.create({ username: 'Alice HR', email: 'alice@techcorp.io', password: hashedPassword, role: 'recruiter' });
        const r3 = await User.create({ username: 'Mark Talent', email: 'mark@startup.com', password: hashedPassword, role: 'recruiter' });

        // Create Candidates
        const candidates = await User.bulkCreate([
            { username: 'Jane Doe', email: 'jane@gmail.com', password: hashedPassword, role: 'candidate' },
            { username: 'Kevin Smith', email: 'kevin@outlook.com', password: hashedPassword, role: 'candidate' },
            { username: 'Sarah Connor', email: 'sarah@skynet.com', password: hashedPassword, role: 'candidate' },
            { username: 'Mike Wazowski', email: 'mike@monsters.inc', password: hashedPassword, role: 'candidate' },
            { username: 'Eleven Hopper', email: 'eleven@hawkins.net', password: hashedPassword, role: 'candidate' },
            { username: 'Bruce Wayne', email: 'bruce@wayne.ent', password: hashedPassword, role: 'candidate' },
            { username: 'Diana Prince', email: 'diana@themyscira.com', password: hashedPassword, role: 'candidate' },
            { username: 'Tony Stark', email: 'tony@starkindustries.com', password: hashedPassword, role: 'candidate' }
        ]);

        // Create Tests
        const t1 = await Test.create({
            title: 'JavaScript Modern ES6+',
            description: 'Deep dive into modern JS features: destructuring, modules, arrow functions, and ES2023 features.',
            duration: 20,
            language: 'JavaScript',
            createdBy: r1.id
        });

        const t2 = await Test.create({
            title: 'Python for Data Science',
            description: 'Testing core Python concepts, list comprehensions, NumPy basics, and data structures.',
            duration: 25,
            language: 'Python',
            createdBy: r1.id
        });

        const t3 = await Test.create({
            title: 'SQL Expert: Complex Queries',
            description: 'Joins, Subqueries, Window functions, and CTEs. Perfect for database engineers.',
            duration: 30,
            language: 'SQL',
            createdBy: r2.id
        });

        const t4 = await Test.create({
            title: 'React Fundamentals',
            description: 'Hooks, Component lifecycle, props, and state management basics.',
            duration: 15,
            language: 'JavaScript',
            createdBy: r2.id
        });

        const t5 = await Test.create({
            title: 'DevOps & Docker Basics',
            description: 'Images, containers, networks, and Docker Compose orchestration.',
            duration: 15,
            language: 'DevOps',
            createdBy: r3.id
        });

        const tests = [t1, t2, t3, t4, t5];

        // Enable adaptive difficulty on some tests
        await t1.update({ adaptiveDifficulty: true });
        await t3.update({ adaptiveDifficulty: true });

        // Questions with varying difficulty levels
        const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];

        for (const test of tests) {
            // Create 3 questions per test with different difficulties
            await Question.create({
                content: `Easy Question for ${test.title}?`,
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: Math.floor(Math.random() * 4),
                points: 1,
                difficulty: 'easy',
                TestId: test.id
            } as any);

            await Question.create({
                content: `Medium Question for ${test.title}?`,
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: Math.floor(Math.random() * 4),
                points: 2,
                difficulty: 'medium',
                TestId: test.id
            } as any);

            await Question.create({
                content: `Hard Question for ${test.title}?`,
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: Math.floor(Math.random() * 4),
                points: 3,
                difficulty: 'hard',
                TestId: test.id
            } as any);
        }

        // Generate Fake Results
        const resultsData = [];
        const allCandidates = await User.findAll({ where: { role: 'candidate' } });

        for (const cand of allCandidates) {
            const numTests = Math.floor(Math.random() * 4) + 1;
            const shuffledTests = [...tests].sort(() => 0.5 - Math.random());

            for (let i = 0; i < numTests; i++) {
                const test = shuffledTests[i];
                if (!test) continue;
                const duration = (test as any).duration || 20;

                // Get questions for this test
                const testQuestions = await Question.findAll({ where: { TestId: test.id } });

                // Generate random answers
                const answers: any = {};
                let correctCount = 0;
                testQuestions.forEach((q: any) => {
                    const randomAnswer = Math.floor(Math.random() * 4); // 0-3
                    answers[q.id] = randomAnswer;
                    if (randomAnswer === q.correctAnswer) {
                        correctCount++;
                    }
                });

                const score = correctCount;
                const maxScore = testQuestions.length;
                const scorePercentage = maxScore > 0 ? score / maxScore : 0;

                resultsData.push({
                    UserId: cand.id,
                    TestId: test.id,
                    score,
                    maxScore,
                    status: 'completed',
                    durationTaken: Math.floor(Math.random() * (duration * 60)),
                    completedAt: new Date(Date.now() - Math.floor(Math.random() * 2592000000)),
                    answers: answers,
                    reviewStatus: scorePercentage < 0.7 ? 'pending' : null,
                    reviewedBy: null
                });
            }
        }

        await Result.bulkCreate(resultsData as any);

        console.log('Database seeded successfully with massive dummy data!');
        process.exit(0);
    } catch (err) {
        console.error('Seed failed:', err);
        process.exit(1);
    }
}

seed();
