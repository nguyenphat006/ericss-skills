# ericss-skills

[English](README.md) | **Tiếng Việt**

made by ericss

Bộ skill cho Claude Code, đóng gói thành plugin marketplace.

## Plugin `landing-kit`

Dựng **landing page / website giới thiệu có CMS cho mọi đề tài**: sản xuất, dịch vụ, SaaS, nhà hàng, khách sạn, bất động sản, giáo dục, y tế, tổ chức, sự kiện...

| Skill | Nội dung |
| --- | --- |
| `landing-cms-stack` | Hỏi khai thác yêu cầu 6 vòng và ghi brief; mô hình nội dung theo từng đề tài; Next.js 16 (App Router, next-intl, shadcn/Tailwind 4) + Django 5.2 LTS / Wagtail 8; cache theo tag và webhook HMAC; phân tầng backend; bảo mật, CI; Docker Compose; file mẫu |
| `landing-design-system` | Token theo vai trò và cách suy ra bảng màu từ màu thương hiệu; component chung; danh mục bố cục section kèm đề tài phù hợp; preset trang cho từng loại website; quy tắc i18n và copy; code tham chiếu |

Hai skill được viết để dùng cùng nhau:
- skill kỹ thuật lo khung và dữ liệu;
- skill thiết kế lo giao diện.

Cả hai luôn **hỏi trước** về đề tài, mục tiêu, cấu trúc nội dung, thông số và màu thương hiệu, rồi mới dựng.

Nội dung skill viết bằng tiếng Anh, nhưng skill luôn trả lời bằng ngôn ngữ bạn dùng, nên cứ hỏi bằng tiếng Việt.

## Cài đặt

Trong Claude Code:

```
/plugin marketplace add nguyenphat006/ericss-skills
/plugin install landing-kit@ericss-skills
```

Hoặc từ terminal:

```
claude plugin marketplace add nguyenphat006/ericss-skills
claude plugin install landing-kit@ericss-skills
```

Cài xong, skill tự kích hoạt khi bạn nhờ dựng website. Cũng có thể gọi thẳng: `/landing-kit:landing-cms-stack`, `/landing-kit:landing-design-system`.

Cập nhật bản mới:

```
claude plugin marketplace update ericss-skills
claude plugin update landing-kit@ericss-skills
```

Không dùng plugin thì chép thư mục `plugins/landing-kit/skills/<tên-skill>` vào:
- `~/.claude/skills/`: dùng cho mọi dự án;
- hoặc `.claude/skills/` của một repo: chỉ dùng trong repo đó.

## Ví dụ yêu cầu

- "Làm website giới thiệu cho phòng khám nha khoa của mình, có CMS để tự đăng dịch vụ và bác sĩ"
- "Dựng landing page cho công ty xuất khẩu gỗ, có catalog sản phẩm lọc theo chất liệu, 2 ngôn ngữ"
- "Thêm trang Phòng có bộ lọc cho website khách sạn, màu chủ đạo xanh navy"

## Cấu trúc repo

```
.claude-plugin/marketplace.json
plugins/landing-kit/
  .claude-plugin/plugin.json
  skills/
    landing-cms-stack/       SKILL.md, references/, assets/
    landing-design-system/   SKILL.md, references/, assets/
```
