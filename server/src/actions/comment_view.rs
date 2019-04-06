extern crate diesel;
use diesel::*;
use diesel::result::Error;
use serde::{Deserialize, Serialize};

// The faked schema since diesel doesn't do views
table! {
  comment_view (id) {
    id -> Int4,
    creator_id -> Int4,
    post_id -> Int4,
    parent_id -> Nullable<Int4>,
    content -> Text,
    published -> Timestamp,
    updated -> Nullable<Timestamp>,
    creator_name -> Varchar,
    score -> BigInt,
    upvotes -> BigInt,
    downvotes -> BigInt,
    user_id -> Nullable<Int4>,
    my_vote -> Nullable<Int4>,
  }
}

#[derive(Queryable, Identifiable, PartialEq, Debug, Serialize, Deserialize,QueryableByName,Clone)]
#[table_name="comment_view"]
pub struct CommentView {
  pub id: i32,
  pub creator_id: i32,
  pub post_id: i32,
  pub parent_id: Option<i32>,
  pub content: String,
  pub published: chrono::NaiveDateTime,
  pub updated: Option<chrono::NaiveDateTime>,
  pub creator_name: String,
  pub score: i64,
  pub upvotes: i64,
  pub downvotes: i64,
  pub user_id: Option<i32>,
  pub my_vote: Option<i32>,
}

impl CommentView {

  pub fn list(conn: &PgConnection, from_post_id: i32, from_user_id: Option<i32>) -> Result<Vec<Self>, Error> {
    use actions::comment_view::comment_view::dsl::*;
    use diesel::prelude::*;

    let mut query = comment_view.into_boxed();

    // The view lets you pass a null user_id, if you're not logged in
    if let Some(from_user_id) = from_user_id {
      query = query.filter(user_id.eq(from_user_id));
    } else {
      query = query.filter(user_id.is_null());
    }

    query = query.filter(post_id.eq(from_post_id)).order_by(published.desc());

    query.load::<Self>(conn) 
  }

  pub fn read(conn: &PgConnection, from_comment_id: i32, from_user_id: Option<i32>) -> Result<Self, Error> {
    use actions::comment_view::comment_view::dsl::*;
    use diesel::prelude::*;

    let mut query = comment_view.into_boxed();

    // The view lets you pass a null user_id, if you're not logged in
    if let Some(from_user_id) = from_user_id {
      query = query.filter(user_id.eq(from_user_id));
    } else {
      query = query.filter(user_id.is_null());
    }

    query = query.filter(id.eq(from_comment_id)).order_by(published.desc());

    query.first::<Self>(conn) 
  }

}


#[cfg(test)]
mod tests {
  use establish_connection;
  use super::*;
  use actions::post::*;
  use actions::community::*;
  use actions::user::*;
  use actions::comment::*;
  use {Crud,Likeable};
 #[test]
  fn test_crud() {
    let conn = establish_connection();

    let new_user = UserForm {
      name: "timmy".into(),
      fedi_name: "rrf".into(),
      preferred_username: None,
      password_encrypted: "nope".into(),
      email: None,
      updated: None
    };

    let inserted_user = User_::create(&conn, &new_user).unwrap();

    let new_community = CommunityForm {
      name: "test community 5".to_string(),
      title: "nada".to_owned(),
      description: None,
      category_id: 1,
      creator_id: inserted_user.id,
      updated: None
    };

    let inserted_community = Community::create(&conn, &new_community).unwrap();
    
    let new_post = PostForm {
      name: "A test post 2".into(),
      creator_id: inserted_user.id,
      url: None,
      body: None,
      community_id: inserted_community.id,
      updated: None
    };

    let inserted_post = Post::create(&conn, &new_post).unwrap();

    let comment_form = CommentForm {
      content: "A test comment 32".into(),
      creator_id: inserted_user.id,
      post_id: inserted_post.id,
      parent_id: None,
      updated: None
    };

    let inserted_comment = Comment::create(&conn, &comment_form).unwrap();

    let comment_like_form = CommentLikeForm {
      comment_id: inserted_comment.id,
      post_id: inserted_post.id,
      user_id: inserted_user.id,
      score: 1
    };

    let _inserted_comment_like = CommentLike::like(&conn, &comment_like_form).unwrap();

    let expected_comment_view_no_user = CommentView {
      id: inserted_comment.id,
      content: "A test comment 32".into(),
      creator_id: inserted_user.id,
      post_id: inserted_post.id,
      parent_id: None,
      published: inserted_comment.published,
      updated: None,
      creator_name: inserted_user.name.to_owned(),
      score: 1,
      downvotes: 0,
      upvotes: 1,
      user_id: None,
      my_vote: None
    };

    let expected_comment_view_with_user = CommentView {
      id: inserted_comment.id,
      content: "A test comment 32".into(),
      creator_id: inserted_user.id,
      post_id: inserted_post.id,
      parent_id: None,
      published: inserted_comment.published,
      updated: None,
      creator_name: inserted_user.name.to_owned(),
      score: 1,
      downvotes: 0,
      upvotes: 1,
      user_id: Some(inserted_user.id),
      my_vote: Some(1),
    };

    let read_comment_views_no_user = CommentView::list(&conn, inserted_post.id, None).unwrap();
    let read_comment_views_with_user = CommentView::list(&conn, inserted_post.id, Some(inserted_user.id)).unwrap();
    let like_removed = CommentLike::remove(&conn, &comment_like_form).unwrap();
    let num_deleted = Comment::delete(&conn, inserted_comment.id).unwrap();
    Post::delete(&conn, inserted_post.id).unwrap();
    Community::delete(&conn, inserted_community.id).unwrap();
    User_::delete(&conn, inserted_user.id).unwrap();

    assert_eq!(expected_comment_view_no_user, read_comment_views_no_user[0]);
    assert_eq!(expected_comment_view_with_user, read_comment_views_with_user[0]);
    assert_eq!(1, num_deleted);
    assert_eq!(1, like_removed);
  }
}
