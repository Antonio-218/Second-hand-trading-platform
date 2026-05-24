INSERT INTO `sys_menu` (`id`, `menu_pid`, `menu_pids`, `is_leaf`, `name`, `url`) VALUES (1, 1, '0', 0, '商品', 'sub1');
INSERT INTO `sys_menu` (`id`, `menu_pid`, `menu_pids`, `is_leaf`, `name`, `url`) VALUES (2, 2, '1', 1, '发布商品', '/api/publish');
INSERT INTO `sys_menu` (`id`, `menu_pid`, `menu_pids`, `is_leaf`, `name`, `url`) VALUES (3, 3, '1', 1, '商品管理', '/api/goodsList');
INSERT INTO `sys_menu` (`id`, `menu_pid`, `menu_pids`, `is_leaf`, `name`, `url`) VALUES (4, 4, '0', 0, '捐赠', 'sub2');
INSERT INTO `sys_menu` (`id`, `menu_pid`, `menu_pids`, `is_leaf`, `name`, `url`) VALUES (5, 5, '4', 1, '捐赠列表', '/api/donateList');
INSERT INTO `sys_menu` (`id`, `menu_pid`, `menu_pids`, `is_leaf`, `name`, `url`) VALUES (6, 6, '0', 1, '订单', 'sub3');
INSERT INTO `sys_menu` (`id`, `menu_pid`, `menu_pids`, `is_leaf`, `name`, `url`) VALUES (7, 7, '6', 1, '评价', '/api/order');
