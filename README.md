# remarkable-story-backend
Backend for remarkable story project

Register: POST /api/register
Request body: 
{
  username: string,
  title: string,
  country: string,
  email: string,
  password: string,
}
Response: "Success"

Login: POST /api/login
Request body:
{
  username: string,
  password: string,
}
Response: { token, id, type, country, username }

Add story: POST /api/stories
Request body:
{
  title: string,
  description: string,
  story: string,
  date: string,
  country: string,
  user_id: number
}
Response: [stories]

Update Story: PUT /api/stories/:id
Request body:
{
  title: string,
  description: string,
  story: string,
  date: string,
  country: string,
  user_id: number
}
Response: [stories]

Add donation: POST /api/donations
Request body:
{
  amount: number,
  user_id: number,
  comment: string,
  name: string,
  country: string,
}
Response: [donations]
