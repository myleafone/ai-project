DROP TABLE IF EXISTS sys_role_menu;
DROP TABLE IF EXISTS sys_user_role;
DROP TABLE IF EXISTS sys_menu;
DROP TABLE IF EXISTS sys_role;
DROP TABLE IF EXISTS sys_user;

CREATE TABLE sys_user (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(100) NOT NULL,
  nickname VARCHAR(50) DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  status TINYINT NOT NULL DEFAULT 1 COMMENT '1启用 0禁用',
  deleted TINYINT NOT NULL DEFAULT 0,
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_username (username),
  KEY idx_phone (phone),
  KEY idx_status_deleted (status, deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE sys_role (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  role_code VARCHAR(50) NOT NULL,
  role_name VARCHAR(50) NOT NULL,
  remark VARCHAR(255) DEFAULT NULL,
  deleted TINYINT NOT NULL DEFAULT 0,
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_role_code (role_code),
  KEY idx_role_name (role_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE sys_menu (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  parent_id BIGINT NOT NULL DEFAULT 0,
  menu_name VARCHAR(50) NOT NULL,
  path VARCHAR(120) DEFAULT NULL,
  component VARCHAR(120) DEFAULT NULL,
  icon VARCHAR(50) DEFAULT NULL,
  sort INT NOT NULL DEFAULT 0,
  menu_type TINYINT NOT NULL DEFAULT 1 COMMENT '1目录 2菜单 3按钮',
  perms VARCHAR(120) DEFAULT NULL,
  deleted TINYINT NOT NULL DEFAULT 0,
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_parent_sort (parent_id, sort),
  KEY idx_menu_type (menu_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE sys_user_role (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  UNIQUE KEY uk_user_role (user_id, role_id),
  KEY idx_role_id (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE sys_role_menu (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  role_id BIGINT NOT NULL,
  menu_id BIGINT NOT NULL,
  UNIQUE KEY uk_role_menu (role_id, menu_id),
  KEY idx_menu_id (menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO sys_user (username, password, nickname, phone, status) VALUES
('admin', '123456', '系统管理员', '13800000000', 1);

INSERT INTO sys_role (role_code, role_name, remark) VALUES
('ADMIN', '管理员', '系统默认管理员角色');

INSERT INTO sys_menu (parent_id, menu_name, path, component, icon, sort, menu_type, perms) VALUES
(0, '系统管理', 'system', '', 'Setting', 1, 1, ''),
(1, '用户管理', 'system/user', 'system/UserView', 'User', 1, 2, 'system:user:list'),
(1, '角色管理', 'system/role', 'system/RoleView', 'Avatar', 2, 2, 'system:role:list'),
(1, '菜单管理', 'system/menu', 'system/MenuView', 'Menu', 3, 2, 'system:menu:list');

INSERT INTO sys_user_role (user_id, role_id) VALUES (1, 1);

INSERT INTO sys_role_menu (role_id, menu_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4);
