import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Expense } from '../expenses/expense.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(expense: Expense) {
    await this.mailerService.sendMail({
      to: expense.user.email,
      subject: 'Despesa Cadastrada',
      template: './expense-created',
      context: {
        description: expense.description,
      },
    });
  }
}
