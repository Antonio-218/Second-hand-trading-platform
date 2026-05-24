INSERT INTO `sys_menu` (`id`, `menu_pid`, `menu_pids`, `is_leaf`, `name`, `url`) VALUES (1, 1, '0', 0, '商品_tlw', 'sub1');
INSERT INTO `sys_menu` (`id`, `menu_pid`, `menu_pids`, `is_leaf`, `name`, `url`) VALUES (2, 2, '1', 1, '发布商品_tlw', '/api/publish');
INSERT INTO `sys_menu` (`id`, `menu_pid`, `menu_pids`, `is_leaf`, `name`, `url`) VALUES (3, 3, '1', 1, '商品管理_tlw', '/api/goodsList');
INSERT INTO `sys_menu` (`id`, `menu_pid`, `menu_pids`, `is_leaf`, `name`, `url`) VALUES (4, 4, '0', 0, '捐赠_tlw', 'sub2');
INSERT INTO `sys_menu` (`id`, `menu_pid`, `menu_pids`, `is_leaf`, `name`, `url`) VALUES (5, 5, '4', 1, '捐赠列表_tlw', '/api/donateList');
INSERT INTO `sys_menu` (`id`, `menu_pid`, `menu_pids`, `is_leaf`, `name`, `url`) VALUES (6, 6, '0', 1, '订单_tlw', 'sub3');
INSERT INTO `sys_menu` (`id`, `menu_pid`, `menu_pids`, `is_leaf`, `name`, `url`) VALUES (7, 7, '6', 1, '评价_tlw', '/api/order');
