enum Role {
  // Can create comments and delete comments they created
  USER = 1,

  // Can create comments and delete any comment
  MODERATOR = 2,

  // Can create comments and delete comments they created
  // Can create posts and edit and delete posts they created
  EDITOR = 3,

  // Can do everything
  ADMIN = 4
}

export default Role
