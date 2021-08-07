export const loginHelper = async (request, app, UserMock) => {
    await request(app.getHttpServer()).post('/auth/signup').send(UserMock)
    const { email, password } = UserMock;
    return await request(app.getHttpServer()).post('/auth/login').send({email, password})
}