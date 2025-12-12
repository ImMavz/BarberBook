import { Injectable, InternalServerErrorException } from '@nestjs/common';
import sgMail = require('@sendgrid/mail');

@Injectable()
export class MailService {
    constructor() {
        if (process.env.SENDGRID_API_KEY) {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        }
    }

    async sendAppointmentConfirmation(to: string, appointmentDetails: any) {
        if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
            console.warn('SendGrid API Key or From Email not set. Skipping email.');
            return;
        }

        const msg = {
            to,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: 'Confirmación de Cita - BarberBook',
            text: `Hola, tu cita ha sido confirmada.\n\n` +
                `Fecha: ${appointmentDetails.fecha}\n` +
                `Hora: ${appointmentDetails.horaInicio}\n` +
                `Barbero: ${appointmentDetails.barbero}\n` +
                `Servicio: ${appointmentDetails.servicio}\n\n` +
                `¡Gracias por confiar en nosotros!`,
            html: `<strong>Hola, tu cita ha sido confirmada.</strong><br><br>` +
                `Fecha: ${appointmentDetails.fecha}<br>` +
                `Hora: ${appointmentDetails.horaInicio}<br>` +
                `Barbero: ${appointmentDetails.barbero}<br>` +
                `Servicio: ${appointmentDetails.servicio}<br><br>` +
                `¡Gracias por confiar en nosotros!`,
        };

        try {
            await sgMail.send(msg);
            console.log(`Email sent to ${to}`);
        } catch (error) {
            console.error('Error sending email:', error);
            if (error.response) {
                console.error(error.response.body);
            }
            // Non-blocking error? Or should we throw? 
            // Usually email failure shouldn't rollback the appointment, just log it.
        }
    }

    async sendNewAppointmentNotification(to: string, appointmentDetails: any) {
        if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
            console.warn('SendGrid API Key or From Email not set. Skipping email.');
            return;
        }

        const msg = {
            to,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: 'Nueva Cita Agendada - BarberBook',
            text: `Hola, tienes una nueva cita agendada.\n\n` +
                `Fecha: ${appointmentDetails.fecha}\n` +
                `Hora: ${appointmentDetails.horaInicio}\n` +
                `Cliente: ${appointmentDetails.cliente}\n` +
                `Servicio: ${appointmentDetails.servicio}\n\n` +
                `Revisa tu agenda para más detalles.`,
            html: `<strong>Hola, tienes una nueva cita agendada.</strong><br><br>` +
                `Fecha: ${appointmentDetails.fecha}<br>` +
                `Hora: ${appointmentDetails.horaInicio}<br>` +
                `Cliente: ${appointmentDetails.cliente}<br>` +
                `Servicio: ${appointmentDetails.servicio}<br><br>` +
                `Revisa tu agenda para más detalles.`,
        };

        try {
            await sgMail.send(msg);
            console.log(`Email notification sent to barber: ${to}`);
        } catch (error) {
            console.error('Error sending email to barber:', error);
            if (error.response) {
                console.error(error.response.body);
            }
        }
    }
}
