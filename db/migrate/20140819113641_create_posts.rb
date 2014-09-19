class CreatePosts < ActiveRecord::Migration
 def self.up
   create_table :users do |t|
     t.string :name
     t.string :password
     t.string :email
     t.string :picture
     t.timestamps
   end
   
   create_table :voxelmodels do |m|
    m.string :name
    m.string :creator
    m.text :content
    m.text :picture
    m.integer :likes
    m.timestamps
  end
  
  create_table :like_lists do |t|
    t.integer :user
    t.integer :model
    t.timestamps
  end
 end

 def self.down
  if ActiveRecord::Base.connection.table_exists? 'users'
   drop_table :users
  end
  if ActiveRecord::Base.connection.table_exists? 'voxelmodels'
   drop_table :voxelmodels
  end
  if ActiveRecord::Base.connection.table_exists? 'like_lists'
   drop_table :like_lists
  end
 end
end

