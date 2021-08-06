import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private logger: Logger = new Logger(AllExceptionsFilter.name)
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        console.log(exception)
        const status = exception instanceof HttpException
            ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
        const message = exception instanceof HttpException 
            ? exception.getResponse() : exception;
        
        this.logger.error(`Status: ${status}, Message: ${JSON.stringify(message)}`);

        response.status(status).json({
            date: new Date().toISOString(),
            url: request.url,
            message,
            status
        })
        
    }

}