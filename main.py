import sqlite3
from datetime import datetime

# Create a new database if it does not exist
conn = sqlite3.connect('inventory.db')

# Create a cursor object
c = conn.cursor()

# Create the item_types table
c.execute("""CREATE TABLE IF NOT EXISTS item_types (
            type_id integer PRIMARY KEY AUTOINCREMENT,
            type_name text
            )""")

# Create the crystals table
c.execute("""CREATE TABLE IF NOT EXISTS crystals (
            crystal_id integer PRIMARY KEY AUTOINCREMENT,
            crystal_name text,
            crystal_style text
            )""")

# Create the materials table
c.execute("""CREATE TABLE IF NOT EXISTS materials (
            material_id integer PRIMARY KEY AUTOINCREMENT,
            material_type text,
            material_name text,
            material_description text
            )""")

# Create the inventory table
c.execute("""CREATE TABLE IF NOT EXISTS inventory (
            item_id integer PRIMARY KEY AUTOINCREMENT,
            item_name text,
            description text,
            SKU text,
            quantity integer,
            price real,
            type_id integer,
            contains_crystals boolean,
            date_last_updated text DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (type_id) REFERENCES item_types(type_id)
            )""")

# Create the inventory_crystals table
c.execute("""CREATE TABLE IF NOT EXISTS inventory_crystals (
            inventory_id integer,
            crystal_id integer,
            FOREIGN KEY (inventory_id) REFERENCES inventory(item_id),
            FOREIGN KEY (crystal_id) REFERENCES crystals(crystal_id)
            )""")

# Create the inventory_materials table
c.execute("""CREATE TABLE IF NOT EXISTS inventory_materials (
            inventory_id integer,
            material_id integer,
            FOREIGN KEY (inventory_id) REFERENCES inventory(item_id),
            FOREIGN KEY (material_id) REFERENCES materials(material_id)
            )""")

# Create the sales table
c.execute("""CREATE TABLE IF NOT EXISTS sales (
            sale_id integer PRIMARY KEY AUTOINCREMENT,
            date_of_sale text DEFAULT CURRENT_TIMESTAMP,
            inventory_id integer,
            quantity_sold integer,
            sale_source text,
            FOREIGN KEY (inventory_id) REFERENCES inventory(item_id)
            )""")

# Create a trigger to update the date_last_updated field in the inventory table
c.execute("""CREATE TRIGGER IF NOT EXISTS update_date_last_updated
            AFTER UPDATE ON inventory
            FOR EACH ROW
            BEGIN
                UPDATE inventory SET date_last_updated = CURRENT_TIMESTAMP WHERE item_id = NEW.item_id;
            END;
            """)

# Commit the changes
conn.commit()

# Insert sample data
c.execute("INSERT INTO item_types (type_name) VALUES ('Bracelet')")
c.execute("INSERT INTO item_types (type_name) VALUES ('Necklace')")

c.execute("INSERT INTO crystals (crystal_name, crystal_style) VALUES ('Amethyst', '6mm bead')")
c.execute("INSERT INTO crystals (crystal_name, crystal_style) VALUES ('Clear Quartz', 'Chip bead')")
c.execute("INSERT INTO crystals (crystal_name, crystal_style) VALUES ('Rose Quartz', '8mm bead')")
c.execute("INSERT INTO crystals (crystal_name, crystal_style) VALUES ('Black Tourmaline', '10mm bead')")

c.execute("INSERT INTO materials (material_type, material_name) VALUES ('Chain', 'Silver')")
c.execute("INSERT INTO materials (material_type, material_name) VALUES ('Chain', 'Stainless Steel')")
c.execute("INSERT INTO materials (material_type, material_name, material_description) VALUES ('Chain', 'Rope', 'Woven cotton rope')")

c.execute("INSERT INTO inventory (item_name, description, SKU, quantity, price, type_id, contains_crystals) VALUES ('Amethyst and Clear Quartz Link Bracelet', 'A beautiful link bracelet featuring amethyst and clear quartz crystals', 'SKU1', 10, 29.99, 1, 1)")
c.execute("INSERT INTO inventory (item_name, description, SKU, quantity, price, type_id, contains_crystals) VALUES ('Rose Quartz and Black Tourmaline Necklace', 'A stunning necklace featuring rose quartz and black tourmaline crystals', 'SKU2', 20, 49.99, 2, 1)")
c.execute("INSERT INTO inventory (item_name, description, SKU, quantity, price, type_id, contains_crystals) VALUES ('Silver Chain Link Necklace', 'A simple yet elegant silver chain link necklace', 'SKU3', 30, 19.99, 2, 0)")
c.execute("INSERT INTO inventory (item_name, description, SKU, quantity, price, type_id, contains_crystals) VALUES ('Amethyst and Clear Quartz Link Necklace', 'A beautiful link necklace featuring amethyst and clear quartz crystals', 'SKU4', 10, 39.99, 2, 1)")
c.execute("INSERT INTO inventory (item_name, description, SKU, quantity, price, type_id, contains_crystals) VALUES ('Rose Quartz and Black Tourmaline Link Bracelet', 'A stunning link bracelet featuring rose quartz and black tourmaline crystals', 'SKU5', 20, 29.99, 1, 1)")
c.execute("INSERT INTO inventory (item_name, description, SKU, quantity, price, type_id, contains_crystals) VALUES ('Stainless Steel Chain Link Necklace', 'A strong and durable stainless steel chain link necklace', 'SKU6', 30, 29.99, 2, 0)")

c.execute("INSERT INTO inventory_crystals VALUES (1, 1)")
c.execute("INSERT INTO inventory_crystals VALUES (1, 2)")
c.execute("INSERT INTO inventory_crystals VALUES (2, 3)")
c.execute("INSERT INTO inventory_crystals VALUES (2, 4)")
c.execute("INSERT INTO inventory_crystals VALUES (4, 1)")
c.execute("INSERT INTO inventory_crystals VALUES (4, 2)")
c.execute("INSERT INTO inventory_crystals VALUES (5, 3)")
c.execute("INSERT INTO inventory_crystals VALUES (5, 4)")

c.execute("INSERT INTO inventory_materials VALUES (1, 1)")
c.execute("INSERT INTO inventory_materials VALUES (2, 2)")
c.execute("INSERT INTO inventory_materials VALUES (3, 1)")
c.execute("INSERT INTO inventory_materials VALUES (4, 1)")
c.execute("INSERT INTO inventory_materials VALUES (5, 2)")
c.execute("INSERT INTO inventory_materials VALUES (6, 2)")

c.execute("INSERT INTO sales (inventory_id, quantity_sold, sale_source) VALUES (1, 2, 'Etsy')")
c.execute("INSERT INTO sales (inventory_id, quantity_sold, sale_source) VALUES (2, 3, 'Storefront')")
c.execute("INSERT INTO sales (inventory_id, quantity_sold, sale_source) VALUES (3, 1, 'Etsy')")
c.execute("INSERT INTO sales (inventory_id, quantity_sold, sale_source) VALUES (4, 2, 'Storefront')")

# Commit the changes
conn.commit()

# Close the connection
conn.close()