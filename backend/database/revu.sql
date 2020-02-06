create table users(
    user_id serial not null primary key,
    email varchar(255) not null,
    verified boolean,
    password_hash varchar(255) not null
);

create table uni(
    uni_id serial not null primary key,
    uni_name varchar(255) not null,
    uni_url varchar(255) not null,
    uni_description text not null
);

create table degree(
    degree_id serial not null primary key,
    degree_name varchar(255) not null,
    degree_desc text not null
);

create table uni_degree(
    uni_id serial not null,
    degree_id serial not null,
    requirements_ucas integer,
    requirements_grades varchar(255),


    primary key (uni_id, degree_id)
);

create table review(
    review_id serial not null primary key,
    uni_id integer not null,
    degree_id integer not null,
    user_id int not null,

    degree_rating integer not null,
    degree_rating_desc varchar(250),
    staff_rating integer not null,
    staff_rating_desc varchar(250),
    facility_rating integer not null,
    facility_rating_desc varchar(250),
    uni_rating integer not null,
    uni_rating_desc varchar(250),
    accommodation_rating integer not null,
    accommodation_rating_desc varchar(250)
)




/*Add test data*/
