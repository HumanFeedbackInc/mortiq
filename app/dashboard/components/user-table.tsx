"use client";

import type { Selection, SortDescriptor } from "@heroui/react";
// import type {ColumnsKey, StatusOptions, users as Users} from "./ui/data";
import type { Key } from "@react-types/shared";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  RadioGroup,
  Radio,
  Chip,
  User,
  Pagination,
  Divider,
  Tooltip,
  useButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";

import { SearchIcon } from "@heroui/shared-icons";
import React, { useMemo, useRef, useCallback, useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

import { CopyText } from "./ui/copy-text";
import { EyeFilledIcon } from "./ui/eye";
import { EditLinearIcon } from "./ui/edit";
import { DeleteFilledIcon } from "./ui/delete";
import { ArrowDownIcon } from "./ui/arrow-down";
import { ArrowUpIcon } from "./ui/arrow-up";

import { useMemoizedCallback } from "./ui/use-memoized-callback";

import {
  columns,
  ColumnsKey,
  INITIAL_VISIBLE_COLUMNS,
  StatusOptions,
  users,
} from "./ui/data";
import { Status } from "./ui/Status";
import { UUID } from "crypto";

export type UserAccountTableType = {
  user_id: UUID;
  account_id: UUID; //should this be the same as user_id?
  role: string; //grabbed from user_roles -> roles table CAN BE ADMIN, INVESTOR, BROKER
  first_name: string;
  last_name: string;
  email: string; //grabbed from auth.users table
  phone: string; //grabbed from auth.users table
  profile_picture: string; //uploaded on (pending) account creation
  account_status: string; //grabbed from account table
  created_at: Date;
};

export type SelectedAction = {
  key: string;
  label: string;
  icon?: any; // Iconify icon name
  onClick?: (selectedUsers: UserAccountTableType[]) => void;
};

export default function UserTable({
  users,
  selectedActions = [],
  title,
}: {
  users: UserAccountTableType[];
  selectedActions: SelectedAction[];
  title: string;
}) {
  console.log("USERS");
  console.table(users);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "created_at",
    direction: "ascending",
  });

  const [roleFilter, setRoleFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const [dateFilter, setDateFilter] = React.useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [userIdFilter, setUserIdFilter] = React.useState("");

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns
      .map((item) => {
        if (item.uid === sortDescriptor.column) {
          return {
            ...item,
            sortDirection: sortDescriptor.direction,
          };
        }

        return item;
      })
      .filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns, sortDescriptor]);

  const itemFilter = useCallback(
    (col: UserAccountTableType) => {
      let allRole = roleFilter === "all";
      let allStatus = statusFilter === "all";
      let matchesUserId =
        !userIdFilter ||
        col.user_id.toLowerCase().includes(userIdFilter.toLowerCase());
      let matchesDate = true;

      if (dateFilter.start && dateFilter.end) {
        matchesDate =
          col.created_at >= dateFilter.start &&
          col.created_at <= dateFilter.end;
      }

      return (
        (allRole || roleFilter === col.role.toLowerCase()) &&
        (allStatus || statusFilter === col.account_status.toLowerCase()) &&
        matchesUserId &&
        matchesDate
      );
    },
    [statusFilter, roleFilter, userIdFilter, dateFilter]
  );

  const filteredItems = useMemo(() => {
    let filteredUsers = [...users];

    // Apply search filter across multiple fields
    if (filterValue) {
      const searchLower = filterValue.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.first_name.toLowerCase().includes(searchLower) ||
          user.last_name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.phone.toLowerCase().includes(searchLower)
      );
    }

    // Apply status and role filters
    filteredUsers = filteredUsers.filter(itemFilter);

    return filteredUsers;
  }, [filterValue, itemFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort(
      (a: UserAccountTableType, b: UserAccountTableType) => {
        const col = sortDescriptor.column as keyof UserAccountTableType;
        const first = a[col];
        const second = b[col];

        const cmp = first < second ? -1 : first > second ? 1 : 0;
        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }
    );
  }, [sortDescriptor, items]);

  const filterSelectedKeys = useMemo(() => {
    if (selectedKeys === "all") return selectedKeys;
    let resultKeys = new Set<Key>();

    if (filterValue) {
      filteredItems.forEach((item) => {
        const stringId = String(item.user_id);

        if ((selectedKeys as Set<string>).has(stringId)) {
          resultKeys.add(stringId);
        }
      });
    } else {
      resultKeys = selectedKeys;
    }

    return resultKeys;
  }, [selectedKeys, filteredItems, filterValue]);

  const eyesRef = useRef<HTMLButtonElement | null>(null);
  const editRef = useRef<HTMLButtonElement | null>(null);
  const deleteRef = useRef<HTMLButtonElement | null>(null);
  const { getButtonProps: getEyesProps } = useButton({ ref: eyesRef });
  const { getButtonProps: getEditProps } = useButton({ ref: editRef });
  const { getButtonProps: getDeleteProps } = useButton({ ref: deleteRef });
  const getMemberInfoProps = useMemoizedCallback(() => ({
    onClick: handleMemberClick,
  }));

  const renderCell = useMemoizedCallback(
    (user: UserAccountTableType, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof UserAccountTableType] as string;

      switch (columnKey) {
        case "user_id":
        case "account_id":
          return <CopyText>{cellValue}</CopyText>;
        case "first_name":
        case "last_name":
        case "email":
        case "phone":
          return (
            <div className="text-small text-default-foreground">
              {cellValue}
            </div>
          );
        case "profile_picture":
          return (
            <User
              avatarProps={{ radius: "lg", src: cellValue }}
              classNames={{
                name: "text-default-foreground",
                description: "text-default-500",
              }}
              description={user.email}
              name={`${user.first_name} ${user.last_name}`}
            />
          );
        case "created_at":
          return (
            <div className="flex items-center gap-1">
              <Icon
                className="h-[16px] w-[16px] text-default-300"
                icon="solar:calendar-minimalistic-linear"
              />
              <p className="text-nowrap text-small text-default-foreground">
                {new Intl.DateTimeFormat("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(cellValue))}
              </p>
            </div>
          );
        case "role":
          let role_color:
            | "default"
            | "primary"
            | "secondary"
            | "success"
            | "warning"
            | "danger"
            | undefined = "default";
          if (cellValue.toLowerCase() === "admin") {
            role_color = "danger";
          } else if (cellValue.toLowerCase() === "investor") {
            role_color = "success";
          } else if (cellValue.toLowerCase() === "broker") {
            role_color = "primary";
          }
          return (
            <Chip color={role_color} size="sm" variant="faded">
              {cellValue}
            </Chip>
          );
        case "account_status":
          let color:
            | "default"
            | "primary"
            | "secondary"
            | "success"
            | "warning"
            | "danger"
            | undefined = "default";
          if (cellValue.toLowerCase() === "pending") {
            color = "warning";
          } else if (cellValue.toLowerCase() === "active") {
            color = "success";
          } else if (cellValue.toLowerCase() === "inactive") {
            color = "danger";
          }
          return (
            <Chip color={color} size="sm" variant="faded">
              {cellValue}
            </Chip>
          );
        // return <Status status={cellValue as StatusOptions} />;
        case "actions":
          return (
            <div className="flex items-center justify-end gap-2">
              <EyeFilledIcon
                {...getEyesProps()}
                className="cursor-pointer text-default-400"
                height={18}
                width={18}
              />
              <EditLinearIcon
                {...getEditProps()}
                className="cursor-pointer text-default-400"
                height={18}
                width={18}
              />
              <DeleteFilledIcon
                {...getDeleteProps()}
                className="cursor-pointer text-default-400"
                height={18}
                width={18}
              />
            </div>
          );
        default:
          return cellValue;
      }
    }
  );

  const onNextPage = useMemoizedCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  });

  const onPreviousPage = useMemoizedCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  });

  const onSearchChange = useMemoizedCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  });

  const onSelectionChange = useMemoizedCallback((keys: Selection) => {
    if (keys === "all") {
      if (filterValue) {
        const resultKeys = new Set(
          filteredItems.map((item) => String(item.user_id))
        );

        setSelectedKeys(resultKeys);
      } else {
        setSelectedKeys(keys);
      }
    } else if (keys.size === 0) {
      setSelectedKeys(new Set());
    } else {
      const resultKeys = new Set<Key>();

      keys.forEach((v) => {
        resultKeys.add(v);
      });
      const selectedValue =
        selectedKeys === "all"
          ? new Set(filteredItems.map((item) => String(item.user_id)))
          : selectedKeys;

      selectedValue.forEach((v) => {
        if (items.some((item) => String(item.user_id) === v)) {
          return;
        }
      });
      setSelectedKeys(new Set(resultKeys));
    }
  });

  const handleActionClick = useCallback(
    (action: SelectedAction) => {
      const selectedUsers =
        filterSelectedKeys === "all"
          ? filteredItems
          : filteredItems.filter((user) =>
              (filterSelectedKeys as Set<string>).has(user.user_id)
            );

      action.onClick?.(selectedUsers);
    },
    [filterSelectedKeys, filteredItems]
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex items-center gap-4 overflow-y-auto overflow-x-scroll px-[6px] py-[4px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4">
            <Input
              className="min-w-[200px]"
              endContent={
                <SearchIcon className="text-default-400" width={16} />
              }
              placeholder="Search by name, email, or phone"
              size="sm"
              value={filterValue}
              onValueChange={onSearchChange}
            />
            <div>
              <Popover placement="bottom">
                <PopoverTrigger>
                  <Button
                    className="bg-default-100 text-default-800"
                    size="sm"
                    startContent={
                      <Icon
                        className="text-default-400"
                        icon="solar:tuning-2-linear"
                        width={16}
                      />
                    }
                  >
                    Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="flex w-full flex-col gap-6 px-2 py-4">
                    <Input
                      label="User ID"
                      placeholder="Search by User ID"
                      value={userIdFilter}
                      onChange={(e) => setUserIdFilter(e.target.value)}
                      size="sm"
                    />

                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium">Date Range</span>
                      <div className="flex gap-2">
                        <Input
                          id="start-date"
                          aria-label="Start Date"
                          type="date"
                          placeholder="Start Date"
                          size="sm"
                          onChange={(e) =>
                            setDateFilter((prev) => ({
                              ...prev,
                              start: e.target.value
                                ? new Date(e.target.value)
                                : null,
                            }))
                          }
                        />
                        <Input
                          id="end-date"
                          aria-label="End Date"
                          type="date"
                          placeholder="End Date"
                          size="sm"
                          onChange={(e) =>
                            setDateFilter((prev) => ({
                              ...prev,
                              end: e.target.value
                                ? new Date(e.target.value)
                                : null,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <RadioGroup
                      label="Role"
                      value={roleFilter}
                      onValueChange={setRoleFilter}
                    >
                      <Radio value="all">All</Radio>
                      <Radio value="admin">Admin</Radio>
                      <Radio value="investor">Investor</Radio>
                      <Radio value="broker">Broker</Radio>
                    </RadioGroup>

                    <RadioGroup
                      label="Status"
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <Radio value="all">All</Radio>
                      <Radio value="active">Active</Radio>
                      <Radio value="inactive">Inactive</Radio>
                      <Radio value="paused">Paused</Radio>
                    </RadioGroup>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="bg-default-100 text-default-800"
                    size="sm"
                    startContent={
                      <Icon
                        className="text-default-400"
                        icon="solar:sort-linear"
                        width={16}
                      />
                    }
                  >
                    Sort
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Sort"
                  items={headerColumns.filter(
                    (c) => !["actions", "teams"].includes(c.uid)
                  )}
                >
                  {(item) => (
                    <DropdownItem
                      key={item.uid}
                      onPress={() => {
                        setSortDescriptor({
                          column: item.uid,
                          direction:
                            sortDescriptor.direction === "ascending"
                              ? "descending"
                              : "ascending",
                        });
                      }}
                    >
                      {item.name}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
            <div>
              <Dropdown closeOnSelect={false}>
                <DropdownTrigger>
                  <Button
                    className="bg-default-100 text-default-800"
                    size="sm"
                    startContent={
                      <Icon
                        className="text-default-400"
                        icon="solar:sort-horizontal-linear"
                        width={16}
                      />
                    }
                  >
                    Columns
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Columns"
                  items={columns.filter((c) => !["actions"].includes(c.uid))}
                  selectedKeys={visibleColumns}
                  selectionMode="multiple"
                  onSelectionChange={setVisibleColumns}
                >
                  {(item) => (
                    <DropdownItem key={item.uid}>{item.name}</DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          <Divider className="h-5" orientation="vertical" />

          <div className="whitespace-nowrap text-sm text-default-800">
            {filterSelectedKeys === "all"
              ? "All items selected"
              : `${filterSelectedKeys.size} Selected`}
          </div>

          {(filterSelectedKeys === "all" || filterSelectedKeys.size > 0) && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="bg-default-100 text-default-800"
                  endContent={
                    <Icon
                      className="text-default-400"
                      icon="solar:alt-arrow-down-linear"
                    />
                  }
                  size="sm"
                  variant="flat"
                >
                  Selected Actions
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Selected Actions">
                {selectedActions.map((action) => (
                  <DropdownItem
                    key={action.key}
                    startContent={action.icon && action.icon}
                    onPress={() => handleActionClick(action)}
                  >
                    {action.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    filterSelectedKeys,
    headerColumns,
    sortDescriptor,
    statusFilter,
    roleFilter,
    setRoleFilter,
    setStatusFilter,
    onSearchChange,
    setVisibleColumns,
    userIdFilter,
    dateFilter,
    setUserIdFilter,
    setDateFilter,
    selectedActions,
    handleActionClick,
  ]);

  const topBar = useMemo(() => {
    return (
      <div className="mb-[18px] flex items-center justify-between">
        <div className="flex w-[226px] items-center gap-2">
          <h1 className="text-2xl font-[700] leading-[32px]">{title}</h1>
          <Chip
            className="hidden items-center text-default-500 sm:flex"
            size="sm"
            variant="flat"
          >
            {users.length}
          </Chip>
        </div>
        <Button
          color="primary"
          endContent={<Icon icon="solar:add-circle-bold" width={20} />}
        >
          Add Member
        </Button>
      </div>
    );
  }, []);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex flex-col items-center justify-between gap-2 px-2 py-2 sm:flex-row">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="flex items-center justify-end gap-6">
          <span className="text-small text-default-400">
            {filterSelectedKeys === "all"
              ? "All items selected"
              : `${filterSelectedKeys.size} of ${filteredItems.length} selected`}
          </span>
          <div className="flex items-center gap-3">
            <Button
              isDisabled={page === 1}
              size="sm"
              variant="flat"
              onPress={onPreviousPage}
            >
              Previous
            </Button>
            <Button
              isDisabled={page === pages}
              size="sm"
              variant="flat"
              onPress={onNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }, [
    filterSelectedKeys,
    page,
    pages,
    filteredItems.length,
    onPreviousPage,
    onNextPage,
  ]);

  const handleMemberClick = useMemoizedCallback(() => {
    setSortDescriptor({
      column: "created_at",
      direction:
        sortDescriptor.direction === "ascending" ? "descending" : "ascending",
    });
  });

  return (
    <div className="h-full max-w-7xl p-6 overflow-x-scroll">
      {topBar}
      <Table
        isHeaderSticky
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          td: "before:bg-transparent",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        // @ts-ignore
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={onSelectionChange}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "end" : "start"}
              className={cn([
                column.uid === "actions"
                  ? "flex items-center justify-end px-[20px]"
                  : "",
              ])}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No users found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.user_id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
