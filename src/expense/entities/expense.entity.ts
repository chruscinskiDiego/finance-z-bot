import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Expense {

    @PrimaryGeneratedColumn()
    id_expense: number;
    
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    value: number;
    
    @Column({ type: 'varchar', length: 255, nullable: false })
    description: string;
    
    @Column({ type: 'varchar', length: 100, nullable: false })
    user: string;

    @CreateDateColumn()
    created_at: Date;
    
}
