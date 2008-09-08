package org.ddth.game.gladiatus.core.auction;

import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.eclipse.swt.SWT;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.graphics.Image;
import org.eclipse.swt.graphics.Rectangle;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Event;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Listener;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.swt.widgets.Table;
import org.eclipse.swt.widgets.TableColumn;
import org.eclipse.swt.widgets.TableItem;
import org.eclipse.swt.widgets.Text;

public class AuctionView extends Shell implements Listener, Runnable {

	private Text txtSession;
	private Table table;
	private Text txtPrice;
	private Text txtAuctionId;
	private Text txtUser;
	private Image image;
	private Label auctionTimer;
	
	private long startingTime;
	private boolean isRunning = false;
	private Map<String, AuctionItem> items = new ConcurrentHashMap<String, AuctionItem>();

	/**
	 * Launch the application
	 * 
	 * @param args
	 */
	public static void main(String args[]) {
		try {
			Display display = Display.getDefault();
			AuctionView shell = new AuctionView(display, SWT.SHELL_TRIM);
			shell.open();
			shell.layout();
			while (!shell.isDisposed()) {
				if (!display.readAndDispatch())
					display.sleep();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * Create the shell
	 * 
	 * @param display
	 * @param style
	 */
	public AuctionView(Display display, int style) {
		super(display, style);
		createContents();
		final GridLayout gridLayout = new GridLayout();
		gridLayout.numColumns = 4;
		setLayout(gridLayout);
	}

	/**
	 * Create contents of the window
	 */
	protected void createContents() {
		setText("SWT Application");
		setSize(437, 544);

		final Label estimateAuctionEndLabel = new Label(this, SWT.NONE);
		estimateAuctionEndLabel.setLayoutData(new GridData(SWT.LEFT, SWT.CENTER, false, false, 2, 1));
		estimateAuctionEndLabel.setText("Auction Ending Time");

		auctionTimer = new Label(this, SWT.NONE);
		auctionTimer.setLayoutData(new GridData());
		auctionTimer.setText("30:00");

		final Button button = new Button(this, SWT.NONE);
		button.setLayoutData(new GridData(SWT.FILL, SWT.CENTER, false, false));
		button.setText("Monitor");
		button.addSelectionListener(new SelectionAdapter() {
			public void widgetSelected(final SelectionEvent e) {
				if (!isRunning) {
					startingTime = System.currentTimeMillis() + 60*30*1000;
					button.setText("Stop Monitoring");
					(new Thread(AuctionView.this)).start();
				}
				else {
					button.setText("Monitor");
				}
				isRunning = !isRunning;
			}
		});

		final Label sessionLabel = new Label(this, SWT.NONE);
		sessionLabel.setText("User");

		txtUser = new Text(this, SWT.BORDER);
		final GridData gd_txtUser = new GridData(SWT.FILL, SWT.CENTER, true, false);
		txtUser.setLayoutData(gd_txtUser);

		final Label sessionLabel_1 = new Label(this, SWT.NONE);
		sessionLabel_1.setText("Session");

		txtSession = new Text(this, SWT.BORDER);
		final GridData gd_txtSession = new GridData(SWT.FILL, SWT.CENTER, true, false);
		txtSession.setLayoutData(gd_txtSession);

		final Label idLabel = new Label(this, SWT.NONE);
		idLabel.setText("Auction ID");

		txtAuctionId = new Text(this, SWT.BORDER);
		final GridData gd_txtAuctionId = new GridData(SWT.FILL, SWT.CENTER, true, false);
		txtAuctionId.setLayoutData(gd_txtAuctionId);

		final Label label_1 = new Label(this, SWT.NONE);
		label_1.setText("Max Price");

		txtPrice = new Text(this, SWT.BORDER);
		final GridData gd_txtPrice = new GridData(SWT.FILL, SWT.CENTER, true, false);
		txtPrice.setLayoutData(gd_txtPrice);
		new Label(this, SWT.NONE);
		new Label(this, SWT.NONE);
		new Label(this, SWT.NONE);

		final Button btnMonitor = new Button(this, SWT.NONE);
		btnMonitor.addSelectionListener(new SelectionAdapter() {
			public void widgetSelected(final SelectionEvent e) {
				try {
					String user = txtUser.getText();
					String maxPrice = txtPrice.getText();
					String id = txtAuctionId.getText();
					String session = txtSession.getText();
					int price = Integer.parseInt(maxPrice);

					AuctionItem item = items.get(id);
					TableItem tableItem = null;
					if (item == null) {
						item = new AuctionItem(id, user, session, price);
						items.put(id, item);

						tableItem = new TableItem(table, SWT.BORDER);
						tableItem.setText(2, "0");
						tableItem.setText(0, id);

						item.index = table.getItemCount() - 1;
					} else {
						tableItem = table.getItem(item.index);
					}

					item.id = id;
					item.session = session;
					item.username = user;
					item.maxPrice = price;

					tableItem.setText(1, user);
					tableItem.setText(3, maxPrice);
				} catch (Exception ex) {
				}
			}
		});

		final GridData gd_btnMonitor = new GridData(SWT.RIGHT, SWT.CENTER, false, false);
		btnMonitor.setLayoutData(gd_btnMonitor);
		btnMonitor.setText("Update");

		table = new Table(this, SWT.BORDER);
		table.setLinesVisible(true);
		table.setHeaderVisible(true);
		table.setLayoutData(new GridData(SWT.FILL, SWT.FILL, true, true, 4, 1));

		TableColumn itemColumn = new TableColumn(table, SWT.NONE);
		itemColumn.setText("Item");
		itemColumn.setWidth(100);
		
		TableColumn userColumn = new TableColumn(table, SWT.NONE);
		userColumn.setText("User");
		userColumn.setWidth(100);

		TableColumn priceColumn = new TableColumn(table, SWT.NONE);
		priceColumn.setText("Price");
		priceColumn.setWidth(100);

		TableColumn maxColumn = new TableColumn(table, SWT.NONE);
		maxColumn.setText("Max");
		maxColumn.setWidth(100);

	}

	@Override
	protected void checkSubclass() {
		// Disable the check that prevents subclassing of SWT components
	}

	public Iterator<AuctionItem> getAuctionItems() {
		return items.values().iterator();
	}
	
	public void handleEvent(Event event) {
		switch (event.type) {
		case SWT.MeasureItem: {
			Rectangle rect = image.getBounds();
			event.width += rect.width;
			event.height = Math.max(event.height, rect.height + 2);
			break;
		}
		case SWT.PaintItem: {
			int x = event.x + event.width;
			Rectangle rect = image.getBounds();
			int offset = Math.max(0, (event.height - rect.height) / 2);
			event.gc.drawImage(image, x, event.y + offset);
			break;
		}
		}
	}

	@Override
	public void run() {
		while (isRunning) {
			try {
				Thread.sleep(500);
			}
			catch (InterruptedException e) {
			}
			monitorAuction();
			updateAuctionTimer();
			updateAuctionItems();
			Iterator<AuctionItem> iterator = getAuctionItems();
			while (iterator.hasNext()) {
				AuctionItem item = iterator.next();
				item.currentPrice += 5;
			}
		}
	}

	private void monitorAuction() {
		
	}

	private void updateAuctionItems() {
		Iterator<AuctionItem> iterator = getAuctionItems();
		while (iterator.hasNext()) {
			final AuctionItem item = iterator.next();
			getDisplay().asyncExec(new Runnable() {
				@Override
				public void run() {
					final TableItem tableItem = table.getItem(item.index);
					tableItem.setText(2, String.valueOf(item.currentPrice));
				}
			});
		}
	}

	private void updateAuctionTimer() {
		final long remainingTime = (startingTime - System.currentTimeMillis())/1000;
		getDisplay().asyncExec(new Runnable() {
			@Override
			public void run() {
				int minute = (int)(remainingTime / 60);
				int second = (int)(remainingTime % 60);
				auctionTimer.setText(minute + ":" + second);
			}
		});
	}
}
