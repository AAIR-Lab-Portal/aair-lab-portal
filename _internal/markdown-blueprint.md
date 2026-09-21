---
title: "Markdown & Content Formatting Blueprint"
date: "2026-09-04"
author: "AAIR Lab Admins"
type: "Tutorial"
excerpt: "The official syntax guide for writing lab publications, handling LaTeX equations, and embedding images."
---

## Frontmatter Requirements

Every document submitted to the lab repository must begin with a YAML frontmatter block. This tells the database how to classify and route the file.

```yaml
---
title: "Your Document Title"
date: "YYYY-MM-DD"
author: "Your Name"
type: "Tutorial" # Or Announcement, Resource
excerpt: "A brief 1-2 sentence summary."
---
```
## LaTeX and Mathematical Notation

The lab portal uses KaTeX for high-performance math rendering.
* Use a single \$ for inline equations: \$E = mc^2\$
* Use double \$\$ for display block equations:
\$\$ \text{similarity} = \cos(\theta) = \frac{\mathbf{A} \cdot \mathbf{B}}{|\mathbf{A}| |\mathbf{B}|} $$

## Image Insertion & Captions

You have two methods for inserting images:
1. **The Header Upload:** Use the cloud upload button in the submission portal. You can add an optional caption via the text field directly below the uploader. This image will appear as a full-width cinematic banner at the top of your document.
2. **Inline Injection:** Use the "Insert Inline Image" button above the Markdown text area. The text you type inside the square brackets `[]` will automatically become a styled, sticky caption beneath the image, and the image itself will become interactive (click-to-zoom).

`![This text becomes your sticky caption](/images/content-type-subfolder/your-image.png)`

* The content type subfolder would include `members`, `news`, `projects`, `publications` and `internal`.

## Author Mapping

The portal features a Smart Author Pill system that dynamically links to researcher profiles. Use the `authors` field (for Publications) or `lead` field (for Projects) in your frontmatter.

* **Lab Members:** Use their exact Name or Researcher ID (e.g., `104` or `"Ngo Minh Chau"`). The system will fetch their avatar and link to their lab profile.
* **External Authors (Standard):** Write their name normally (e.g., `"Yann LeCun"`). It will render with a generic user icon.
* **External Authors (Linked):** Use Markdown link syntax (e.g., `"[Dr. Andrew Ng](https://scholar.google.com/...)"`). The system will render an external link icon and route the pill to their portfolio.