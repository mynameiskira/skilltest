import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class User extends Model {
    declare id: number;
    declare username: string;
    declare email: string;
    declare password: string;
    declare role: 'admin' | 'recruiter' | 'candidate';
}

User.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'recruiter', 'candidate'), defaultValue: 'candidate' }
}, { sequelize, modelName: 'User' });

class Test extends Model {
    declare id: number;
    declare title: string;
    declare description: string;
    declare duration: number;
    declare language: string;
    declare createdBy: number;
    declare adaptiveDifficulty: boolean;
}

Test.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    duration: { type: DataTypes.INTEGER, defaultValue: 30 },
    language: { type: DataTypes.STRING, allowNull: false },
    createdBy: { type: DataTypes.INTEGER, allowNull: false },
    adaptiveDifficulty: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { sequelize, modelName: 'Test' });

class Question extends Model {
    declare id: number;
    declare content: string;
    declare options: any[];
    declare correctAnswer: number;
    declare points: number;
    declare difficulty: 'easy' | 'medium' | 'hard';
    declare TestId: number;
}

Question.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    options: { type: DataTypes.JSON, allowNull: false },
    correctAnswer: { type: DataTypes.INTEGER, allowNull: false },
    points: { type: DataTypes.INTEGER, defaultValue: 1 },
    difficulty: { type: DataTypes.ENUM('easy', 'medium', 'hard'), defaultValue: 'medium' }
}, { sequelize, modelName: 'Question' });

class Result extends Model {
    declare id: number;
    declare score: number;
    declare maxScore: number;
    declare status: 'started' | 'completed';
    declare durationTaken: number;
    declare completedAt: Date;
    declare answers: any;
    declare reviewStatus: 'pending' | 'approved' | 'rejected' | null;
    declare reviewedBy: number | null;
}

Result.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
    maxScore: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.ENUM('started', 'completed'), defaultValue: 'started' },
    durationTaken: { type: DataTypes.INTEGER },
    completedAt: { type: DataTypes.DATE },
    answers: { type: DataTypes.JSON },
    reviewStatus: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), allowNull: true },
    reviewedBy: { type: DataTypes.INTEGER, allowNull: true }
}, { sequelize, modelName: 'Result' });

// Associations
User.hasMany(Test, { foreignKey: 'createdBy' });
Test.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });

Test.hasMany(Question, { onDelete: 'CASCADE' });
Question.belongsTo(Test);

User.hasMany(Result);
Result.belongsTo(User);

Test.hasMany(Result);
Result.belongsTo(Test);

export { User, Test, Question, Result, sequelize };
